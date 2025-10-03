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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Import custom hooks.
import { useAuth } from '@/hooks/use-auth';
// Import icons.
import { PlusCircle, Newspaper, MessageSquare, Star, Edit, Settings } from "lucide-react";
// Import Next.js components for navigation.
import Link from 'next/link';
import { getPostsByUserId, getCommentsByUserId } from '@/lib/firestore';
import { Post, Comment } from '@/lib/types';
import Head from 'next/head';

// The main component for the Dashboard page.
export default function DashboardPage() {
  // Get user data and authentication status from the `useAuth` hook.
  const { user, loading } = useAuth();
  // State to hold the user's posts. Initialized with some placeholder data.
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  // State for the user's progress bar.
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    if (user) {
      getPostsByUserId(user.uid).then(setUserPosts);
      getCommentsByUserId(user.uid).then(setUserComments);
    }
  }, [user]);

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
  const getStatusBadge = (status: Post['status'] | Comment['status']) => {
    switch (status) {
      case 'published':
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">{status}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{status}</Badge>;
      case 'draft':
        return <Badge variant="outline">{status}</Badge>;
      case 'rejected':
         return <Badge className="bg-red-100 text-red-800 border-red-200">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // The main JSX for the dashboard layout.
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
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
                 <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/dashboard/profile">Edit Profile</Link>
                 </Button>
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
                  href="/dashboard/profile"
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
            <Tabs defaultValue="stories">
              <TabsList>
                <TabsTrigger value="stories">My Stories</TabsTrigger>
                <TabsTrigger value="comments">My Comments</TabsTrigger>
              </TabsList>
              <TabsContent value="stories">
                <Card>
                  <CardHeader>
                    <CardTitle>My Stories & Submissions</CardTitle>
                    <CardDescription>An overview of all the travel stories you have submitted.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {userPosts.map(post => (
                        <li key={post.id} className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{post.title}</h4>
                            <p className="text-sm text-gray-500">Submitted on {post.created_at.toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {getStatusBadge(post.status)}
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/posts/edit/${post.id}`}>
                                <Edit className="mr-2 h-3 w-3" />
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="comments">
                <Card>
                  <CardHeader>
                    <CardTitle>My Comments</CardTitle>
                    <CardDescription>An overview of all your comments on travel stories.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {userComments.map(comment => (
                        <li key={comment.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{comment.comment_text}</p>
                            <p className="text-sm text-gray-500">Commented on {comment.created_at.toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {getStatusBadge(comment.status)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  );
}
