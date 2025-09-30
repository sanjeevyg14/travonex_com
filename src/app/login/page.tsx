// This file creates the login page for the application.
// It includes a form for email/password login and a button for Google Sign-In.

// This is a Client Component because it uses hooks like `useState` and `useRouter`,
// and handles user interactions (form submission).
'use client';

// Import React hooks for state management.
import { useState } from 'react';
// Import Next.js components for navigation.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Import UI components from ShadCN.
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
// Import the custom authentication hook.
import { useAuth } from '@/hooks/use-auth';
// Import icons.
import { Chrome } from 'lucide-react';

// The main component for the Login Page.
export default function LoginPage() {
  // Get the login and googleSignIn functions from the authentication context.
  const { login, googleSignIn, user } = useAuth();
  // Get the router instance to redirect the user after login.
  const router = useRouter();
  
  // State to manage the email and password form fields.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State to hold any error messages from the login process.
  const [error, setError] = useState<string | null>(null);
  // State to manage the loading status while the login is in progress.
  const [isLoading, setIsLoading] = useState(false);
  
  // Handler for the standard email/password form submission.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the browser's default form submission.
    setIsLoading(true); // Set loading state to true.
    setError(null); // Clear any previous errors.
    
    try {
      // Call the login function from the auth context.
      await login(email, password);
      // If login is successful, redirect to the dashboard.
      router.push('/dashboard');
    } catch (err: unknown) {
      // If there's an error, display a generic message.
      // In a real application, you might want to parse the error object (err)
      // to provide more specific feedback (e.g., "Invalid password").
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      // Reset loading state regardless of the outcome.
      setIsLoading(false);
    }
  };
  
  // Handler for the Google Sign-In button click.
  const handleGoogleSignIn = async () => {
    setIsLoading(true); // Set loading state.
    setError(null); // Clear errors.
    
    try {
      // Call the googleSignIn function from the auth context.
      await googleSignIn();
      // On success, redirect to the dashboard.
      router.push('/dashboard');
    } catch (err: unknown) {
      // Handle potential errors.
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during Google Sign-In.');
      }
    } finally {
      // Reset loading state.
      setIsLoading(false);
    }
  };
  
  // If the user is already logged in, redirect them to the dashboard.
  // This prevents a logged-in user from seeing the login page again.
  if (user) {
    router.push('/dashboard');
    return null; // Return null to prevent rendering the login form while redirecting.
  }

  // The JSX for the login page layout.
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            {/* Display any error messages here. */}
            {error && <p className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded-md">{error}</p>}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading} // Disable input while loading.
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <Separator className="my-6" />
          {/* Google Sign-In Button */}
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            <Chrome className="mr-2 h-5 w-5" /> Login with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
