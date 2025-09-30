// This file creates the user registration (signup) page.

// This must be a Client Component because it handles user input and form state,
// and interacts with the client-side authentication context.
'use client';

// Import necessary libraries and components for form handling and validation.
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
// Import UI components.
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Import Next.js hooks and components for navigation.
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Import React hooks.
import { useState, useEffect } from "react";
// Import the custom authentication hook.
import { useAuth } from "@/hooks/use-auth";

// Define the validation schema for the signup form using Zod.
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

// The main component for the SignupPage.
export default function SignupPage() {
  // Get the router instance for redirects.
  const router = useRouter();
  // State for loading indicators on buttons.
  const [isLoading, setIsLoading] = useState(false);
  // State to hold and display any errors from the signup process.
  const [error, setError] = useState<string | null>(null);
  // Destructure functions and state from the authentication hook.
  const { signup, loginWithGoogle, user, userRole } = useAuth();

  // Initialize react-hook-form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // This effect handles redirection after a successful signup/login.
  useEffect(() => {
    if (user) {
      // Admins and editors are sent to the admin dashboard.
      if (userRole === 'admin' || userRole === 'editor') {
        router.push('/blog/admin');
      } else {
        // Regular users are sent to their personal dashboard.
        router.push('/dashboard');
      }
    }
  }, [user, userRole, router]);

  // Function to handle form submission.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      // Call the signup function from the auth hook.
      await signup(values.email, values.password, values.name);
      // Redirection is handled by the `useEffect` hook.
    } catch (error: any) {
      // Display any errors from the signup attempt.
      setError(error.message);
    } finally {
        setIsLoading(false);
    }
  }

  // Function to handle Google Sign-In.
  async function handleGoogleSignIn() {
      setIsLoading(true);
      setError(null);
      try {
        await loginWithGoogle();
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
  }

  // If a user is already logged in, don't show the form. Show a redirect message instead.
  if (user) {
     return (
        <div className="flex items-center justify-center min-h-screen">
            <p>You are already logged in. Redirecting...</p>
        </div>
    );
  }

  // The JSX for the signup form.
  return (
     <div className="flex items-center justify-center min-h-screen bg-secondary">
        <Card className="w-full max-w-md mx-auto shadow-xl rounded-2xl border-none">
            <CardHeader className="text-center p-8">
                <CardTitle className="font-headline text-3xl md:text-4xl">Create an Account</CardTitle>
                <CardDescription className="pt-2">Join Travonex to share your travel stories.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                {/* Conditionally display an error alert. */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTitle>Signup Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your Name" {...field} className="rounded-xl p-6" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} className="rounded-xl p-6"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="rounded-xl p-6"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full rounded-2xl p-6 font-bold" size="lg" disabled={isLoading}>
                         {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>
                </Form>
                 <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full rounded-2xl p-6 font-bold" size="lg" onClick={handleGoogleSignIn} disabled={isLoading}>
                    Sign Up with Google
                </Button>
                 <div className="mt-6 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline hover:text-primary">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
     </div>
  )
}
