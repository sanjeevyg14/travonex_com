// This file creates the personal dashboard page for a logged-in user.
// It allows users to see the status of their submitted stories and comments.

// This is a Client Component because it relies on the authentication state (`useAuth`)
// and displays data specific to the currently logged-in user.
'use client';

// Import UI components.
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// Import icons.
import { PlusCircle, CheckCircle, XCircle, Send } from "lucide-react";
// Import Next.js components for navigation.
import Link from "next/link";
// Import layout components.
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
// Import the custom authentication hook to get the current user.
import { useAuth } from "@/hooks/use-auth";
// Import mock data. In a real application, this data would be fetched from a database.
import { mockFollowUpStories, mockPosts, FollowUpStory } from "@/lib/mock-data";
// Import date formatting utility.
import { format } from "date-fns";

// A helper component to render a styled badge based on the submission's status.
// This keeps the main component's JSX cleaner.
const getStatusBadge = (status: FollowUpStory['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200"><CheckCircle className="mr-1 h-3 w-3" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"><Send className="mr-1 h-3 w-3" />Pending Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

// The main component for the User Dashboard page.
export default function UserDashboard() {
  // Get the current user object from the authentication hook.
  const { user } = useAuth();
  
  // In a real app, this would be an API call to fetch submissions for the current user's ID.
  // Here, we filter the global mock data to find stories submitted by the logged-in user.
  // The `user?.uid` safely handles the case where the user might be null.
  const userStories = user ? mockFollowUpStories.filter(story => story.userId === user.uid) : [];

  // The JSX for the page layout.
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Submissions</CardTitle>
                <CardDescription>Track the status of your submitted stories.</CardDescription>
              </div>
              <Button asChild>
                <Link href="/dashboard/submit">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Submit New Story
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {/* Conditionally render the table if the user has submissions, otherwise show a message. */}
              {userStories.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Story Excerpt</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>On Post</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Map over the user's stories to create a table row for each one. */}
                        {userStories.map(story => {
                            // Find the post associated with the story to display its title.
                            const post = mockPosts.find(p => p.id === story.postId);
                            return (
                                <TableRow key={story.id}>
                                    <TableCell className="font-medium truncate max-w-xs">{story.story_text}</TableCell>
                                    <TableCell>{getStatusBadge(story.status)}</TableCell>
                                    <TableCell>
                                        {/* Link to the original post where the story was submitted. */}
                                        <Link href={`/blog/${post?.slug}`} className="hover:underline" target="_blank">
                                            {post?.title || 'Unknown Post'}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{format(new Date(story.created_at), 'yyyy-MM-dd')}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
              ) : (
                 // This message is displayed if the user has not submitted any stories yet.
                 <div className="text-center py-12 text-muted-foreground">
                    <p>You haven't submitted any stories yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
