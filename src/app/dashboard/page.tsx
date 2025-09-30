// This file creates the main dashboard page for authenticated users.
// It provides an overview of the user's activity and quick access to actions.

// This is a Client Component because it uses the `useAuth` hook to access
// the current user's state, which is only available on the client.
'use client';

// Import React hooks for state management.
import { useState, useEffect } from 'react';
// Import UI components.
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
// Import custom hooks.
import { useAuth } from '@/hooks/use-auth';
// Import icons.
import { PlusCircle, Newspaper, MessageSquare, Star, Edit, Settings } from "lucide-react";
// Import Next.js components for navigation.
import Link from 'next/link';

// Define the shape of the data for the user's posts.
// This would typically be defined in a shared types file (e.g., `types.ts`).
interface UserPost {
  id: string;
  title: string;
  status: 'published' | 'pending' | 'draft' | 'rejected';
  createdAt: string;
}

// The main component for the Dashboard page.
export default function DashboardPage() {
  // Get user data and authentication status from the `useAuth` hook.
  const { user, loading } = useAuth();
  // State to hold the user's posts. Initialized with some placeholder data.
  const [userPosts, setUserPosts] = useState<UserPost[]>([
    { id: '1', title: 'My First Trip to the Alps', status: 'published', createdAt: '2023-09-15' },
    { id: '2', title: 'Exploring the Amazon Rainforest', status: 'pending', createdAt: '2023-10-02' },
    { id: '3', title: 'A Culinary Tour of Italy (Draft)', status: 'draft', createdAt: '2023-10-05' },
  ]);
  // State for the user's progress bar.
  const [progress, setProgress] = useState(13);

  // An effect to simulate the progress bar filling up on component mount.
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  // While the user's authentication state is loading, display a simple message.
  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  // If the user is not authenticated, they shouldn't see this page.
  // Although middleware should handle redirection, this is a fallback.
  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }
  
  // Helper component to render a styled badge based on the post's status.
  const getStatusBadge = (status: UserPost['status']) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Published</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'rejected':
         return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // The main JSX for the dashboard layout.
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      {/* Sidebar Navigation (visible on larger screens) */}
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <span className="">Travonex</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            {/* The user's profile section in the sidebar. */}
            <div className="px-4 text-center">
              <Avatar className="mx-auto h-24 w-24 mb-2">
                <AvatarImage src={user.photoURL || 'https://i.pravatar.cc/150'} />
                <AvatarFallback>{user.displayName ? user.displayName.charAt(0) : 'U'}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{user.displayName || 'User Name'}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-2">You&apos;re a valued member of our community. Thanks for sharing your adventures!</p>
               <Button variant="outline" size="sm" className="mt-4">Edit Profile</Button>
            </div>
            <Separator className="my-4" />
            {/* The main navigation links in the sidebar. */}
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-gray-900 bg-gray-100 dark:bg-gray-800 dark:text-gray-50"
                href="/dashboard"
              >
                <Newspaper className="h-4 w-4" />
                My Stories
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                <MessageSquare className="h-4 w-4" />
                My Comments
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                <Star className="h-4 w-4" />
                My Favorites
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </Link>
            </nav>
          </div>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link className="lg:hidden" href="/">
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
             <h1 className="text-lg font-semibold">My Dashboard</h1>
          </div>
           <Button asChild>
              <Link href="/dashboard/submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                Submit a New Story
              </Link>
            </Button>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <div className="grid gap-6">
            {/* User's Posts Section */}
            <Card>
              <CardHeader>
                <CardTitle>My Stories & Submissions</CardTitle>
                <CardDescription>An overview of all the travel stories you have submitted.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {/* Map over the user's posts and display them in a list. */}
                  {userPosts.map(post => (
                    <li key={post.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{post.title}</h4>
                        <p className="text-sm text-gray-500">Submitted on {post.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(post.status)}
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Profile Completion / Gamification Section */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>Unlock new features and earn a special badge by completing your profile.</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="w-full" />
              </CardContent>
              <CardFooter>
                 <p className="text-xs text-muted-foreground">You're almost there! A complete profile helps build trust in the community.</p>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
