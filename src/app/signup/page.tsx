// This file creates the signup page for new users.
// It includes a form for creating an account with email/password and a button for Google Sign-Up.

// This is a Client Component due to its use of `useState`, `useRouter`, and form event handling.
'use client';

// Import React hooks.
import { useState, useEffect } from 'react';
// Import Next.js components and hooks.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Import UI components.
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
// Import custom authentication hook.
import { useAuth } from '@/hooks/use-auth';
// Import icons.
import { Chrome } from 'lucide-react';

// The main component for the Signup Page.
export default function SignupPage() {
  // Get the signup and googleSignIn functions from the auth context.
  const { signup, googleSignIn, user } = useAuth();
  // Get the router instance for redirection.
  const router = useRouter();

  // State for form fields.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  // State for error handling and loading status.
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handler for the email/password signup form.
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic client-side validation.
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      // Call the signup function from the auth context.
      await signup(email, password, displayName);
      // Redirect to the dashboard on successful signup.
      router.push('/dashboard');
    } catch (err: unknown) {
      // Handle potential errors (e.g., email already in use).
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler for the Google Sign-In button.
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // The same `googleSignIn` function can be used for both login and signup.
      // Firebase handles the creation of a new user if they don't exist.
      await googleSignIn();
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during Google Sign-In.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If a user is already logged in, they should be redirected.
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // The JSX for the signup page layout.
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid gap-4">
            {/* Display any error messages here. */}
            {error && <p className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded-md">{error}</p>}
            <div className="grid gap-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input 
                id="display-name" 
                placeholder="Max Robinson" 
                required 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
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
              {isLoading ? 'Creating Account...' : 'Create an account'}
            </Button>
          </form>
          <Separator className="my-6" />
          {/* Google Sign-In Button */}
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
             <Chrome className="mr-2 h-5 w-5" /> Sign up with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
