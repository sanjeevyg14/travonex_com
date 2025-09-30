// This file creates the login page for the application.

// This must be a Client Component because it handles user input, form state (`useForm`),
// and client-side logic for authentication (`useAuth`, `useRouter`).
'use client';

// Import the resolver for integrating Zod with react-hook-form for validation.
import { zodResolver } from "@hookform/resolvers/zod";
// Import the main hook from react-hook-form.
import { useForm } from "react-hook-form";
// Import Zod for schema validation.
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
// Import Next.js hooks for navigation.
import { useRouter } from 'next/navigation';
import Link from "next/link";
// Import React hooks for state management.
import { useState, useEffect } from "react";
// Import the custom authentication hook.
import { useAuth } from "@/hooks/use-auth";

// Define the validation schema for the login form using Zod.
// This ensures that the email is a valid email format and the password is not empty.
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

// The main component for the LoginPage.
export default function LoginPage() {
  // Get the router instance for redirects.
  const router = useRouter();
  // State to manage the loading state of the form submission buttons.
  const [isLoading, setIsLoading] = useState(false);
  // State to hold any error messages from the login attempt.
  const [error, setError] = useState<string | null>(null);
  // Destructure the authentication functions and state from the `useAuth` hook.
  const { login, loginWithGoogle, user, userRole } = useAuth();

  // Initialize react-hook-form with the Zod schema resolver.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // This `useEffect` hook handles redirecting the user after they have successfully logged in.
  useEffect(() => {
    if (user) {
      // If the user has an 'admin' or 'editor' role, redirect to the admin dashboard.
      if (userRole === 'admin' || userRole === 'editor') {
        router.push('/blog/admin');
      } else {
        // Otherwise, redirect to the personal user dashboard.
        router.push('/dashboard');
      }
    }
  }, [user, userRole, router]); // This effect runs when user, userRole, or router changes.

  // The function to handle form submission for email/password login.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true); // Disable buttons.
    setError(null); // Clear previous errors.
    try {
      // Call the login function from the auth hook.
      await login(values.email, values.password);
      // Redirection is now handled by the `useEffect` above.
    } catch (error: any) {
      // If the login fails, set the error message to be displayed in the UI.
      setError(error.message);
    } finally {
      setIsLoading(false); // Re-enable buttons.
    }
  }

  // The function to handle the "Sign In with Google" button click.
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

  // If a user is already logged in and lands on this page, show a redirecting message.
  // This prevents them from seeing the login form again.
  if (user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>You are already logged in. Redirecting...</p>
        </div>
    );
  }

  // The JSX for the login form.
  return (
     <div className="flex items-center justify-center min-h-screen bg-secondary">
        <Card className="w-full max-w-md mx-auto shadow-xl rounded-2xl border-none">
            <CardHeader className="text-center p-8">
                <CardTitle className="font-headline text-3xl md:text-4xl">Welcome Back</CardTitle>
                <CardDescription className="pt-2">Sign in to your Travonex account.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                {/* Conditionally render the error alert if a login error occurred. */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {/* The Form component from react-hook-form provides context to the form fields. */}
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>
                </Form>
                {/* The "Or continue with" separator. */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>
                {/* The Google Sign-In button. */}
                <Button variant="outline" className="w-full rounded-2xl p-6 font-bold" size="lg" onClick={handleGoogleSignIn} disabled={isLoading}>
                    Sign In with Google
                </Button>
                <div className="mt-6 text-center text-sm">
                    Don't have an account?{" "}
                    <Link href="/signup" className="underline hover:text-primary">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
     </div>
  )
}
