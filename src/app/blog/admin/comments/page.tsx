// This file creates the page for moderating user-submitted comments in the admin dashboard.
// It allows admins and editors to approve, reject, or delete comments.

// The 'use client' directive is necessary because this is a Client Component.
// It uses React hooks like `useState` and handles user interactions (button clicks),
// which can only be done on the client-side.
'use client';

// Import React hooks for state management.
import { useState } from 'react';
// Import UI components from the ShadCN library.
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Import date formatting utility.
import { format } from 'date-fns';
// Import mock data and types. In a real app, this would be an API client.
import { mockComments as initialComments, mockUsers, mockPosts, Comment } from '@/lib/mock-data';
// Import icons for the action buttons.
import { ThumbsUp, ThumbsDown, Trash2, CheckCircle, XCircle, Send } from 'lucide-react';
// Import the Next.js Link component for navigation.
import Link from 'next/link';
// Import the custom authentication hook to get user role and information.
import { useAuth } from '@/hooks/use-auth';
// Import the custom hook for showing toast notifications.
import { useToast } from '@/hooks/use-toast';

// Helper function to find user information by ID from the mock data.
// This centralizes the logic for retrieving user details.
const getUserInfo = (userId: string) => mockUsers.find(u => u.id === userId) || { name: 'Unknown', avatar: '' };

// Helper function to find post information by ID from the mock data.
// Used to link comments back to the original article.
const getPostInfo = (postId: string) => mockPosts.find(p => p.id === postId) || { title: 'Unknown Post', slug: '#' };

// The main component for the Admin Comments Page.
export default function AdminCommentsPage() {
  // State to hold the list of comments. It's initialized with the mock data.
  // Using state allows the UI to reactively update when comments are approved, rejected, or deleted.
  const [comments, setComments] = useState<Comment[]>(initialComments);
  // Get the current user's role from the auth hook to control permissions (e.g., only admins can delete).
  const { userRole } = useAuth();
  // Get the `toast` function to show feedback to the user after an action.
  const { toast } = useToast();

  // Handler function to change the status of a comment.
  const handleStatusChange = (commentId: string, newStatus: Comment['status']) => {
    // Update the `comments` state by mapping over the array.
    // If a comment's ID matches, its status is updated. Otherwise, it remains unchanged.
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, status: newStatus } : c
    ));
    // Show a success notification to the moderator.
    toast({
        title: "Comment Updated",
        description: `The comment has been ${newStatus}.`
    });
  };
  
  // Handler function to delete a comment.
  const handleDelete = (commentId: string) => {
      // Update the `comments` state by filtering out the comment with the matching ID.
      setComments(comments.filter(c => c.id !== commentId));
      // Show a destructive notification to confirm the deletion.
      toast({
        title: "Comment Deleted",
        description: "The comment has been permanently removed.",
        variant: "destructive"
    });
  }

  // A helper component to render the correct badge based on the comment's status.
  // This makes the main render method cleaner and easier to read.
  const getStatusBadge = (status: Comment['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200"><CheckCircle className="mr-1 h-3 w-3" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"><Send className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // The JSX structure for the page.
  return (
    <Card>
      <CardHeader>
        <CardTitle>Moderate Comments</CardTitle>
        <CardDescription>Approve or reject comments submitted by users.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>In Response To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Map over the `comments` state array to render a row for each comment. */}
            {comments.map(comment => {
              // Retrieve author and post info for the current comment in the loop.
              const author = getUserInfo(comment.userId);
              const post = getPostInfo(comment.postId);
              return (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium">{author.name}</TableCell>
                  <TableCell className="text-muted-foreground">{comment.comment_text}</TableCell>
                  <TableCell>
                    {/* Link to the original blog post so the moderator can see the context. */}
                    <Link href={`/blog/${post.slug}`} className="hover:underline" target="_blank">
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {/* Render the status badge using the helper component. */}
                    {getStatusBadge(comment.status)}
                  </TableCell>
                  <TableCell>{format(new Date(comment.created_at), 'yyyy-MM-dd')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                        {/* Conditionally render the 'Approve' button if the status is not already 'approved'. */}
                        {comment.status !== 'approved' && (
                            <Button variant="outline" size="icon" title="Approve" onClick={() => handleStatusChange(comment.id, 'approved')}>
                                <ThumbsUp className="h-4 w-4 text-green-600" />
                            </Button>
                        )}
                        {/* Conditionally render the 'Reject' button if the status is not already 'rejected'. */}
                        {comment.status !== 'rejected' && (
                            <Button variant="outline" size="icon" title="Reject" onClick={() => handleStatusChange(comment.id, 'rejected')}>
                                <ThumbsDown className="h-4 w-4 text-red-600" />
                            </Button>
                        )}
                        {/* Conditionally render the 'Delete' button only if the logged-in user is an admin. */}
                        {userRole === 'admin' && (
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-red-100" title="Delete" onClick={() => handleDelete(comment.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
