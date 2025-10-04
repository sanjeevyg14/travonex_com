// This file creates the page for managing all blog posts in the admin dashboard.
// It displays a table of posts and provides actions like editing, publishing, and deleting.

// This is a Client Component because it uses state (`useState`) to manage the list of posts
// and handles user interactions (button clicks) that modify this state.
'use client';

// Import React hooks.
import { useState, useEffect } from 'react';
// Import UI components.
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
// Import icons.
import { PlusCircle, MoreHorizontal, CheckCircle, XCircle, Send, Trash2, Archive, Eye } from "lucide-react";
// Import date formatting utility.
import { format, isValid } from 'date-fns';
// Import Firestore functions.
import { getPosts, getUsers, updatePost, deletePost as deletePostFromFirestore } from '@/lib/firestore';
import { Post, User } from '@/lib/types';
// Import custom hooks for authentication and notifications.
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
// Import Next.js Link component.
import Link from 'next/link';

// The main component for the Admin Posts page.
export default function AdminPostsPage() {
  // State to hold the list of posts, initialized with data from the mock file.
  // Using state allows the UI to update instantly when a post's status changes or it's deleted.
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  // Get the current user's role to control access to actions (e.g., only admins can delete).
  const { userRole, loading } = useAuth();
  // Get the toast function for user feedback.
  const { toast } = useToast();

  useEffect(() => {
    if (loading) return;

    if (userRole === 'admin' || userRole === 'editor') {
        async function fetchData() {
          const posts = await getPosts();
          setPosts(posts);
          const users = await getUsers();
          setUsers(users);
        }
        fetchData();
    }
  }, [loading, userRole]);

  const getAuthorName = (post: Post) => {
    const authorId = post.authorId || post.author_id;
    const user = users.find(u => u.id === authorId);
    return user ? user.name : 'Unknown Author';
  };

  // Handler to change the status of a post (e.g., from 'pending' to 'published').
  const handleStatusChange = async (postId: string, newStatus: Post['status']) => {
    // Update the post in Firestore.
    await updatePost(postId, { status: newStatus });
    // Update the local `posts` state.
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: newStatus } : post
    ));
    // Show a confirmation toast.
    toast({
        title: "Post Updated",
        description: `The post has been moved to ${newStatus}.`
    });
  };

  // Handler to delete a post.
  const handleDelete = async (postId: string) => {
      // Call the `deletePost` function from the mock data library to update the "source of truth".
      await deletePostFromFirestore(postId); 
      // Update the local state to remove the post from the UI immediately.
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
      // Show a destructive toast to confirm the deletion.
      toast({
        title: "Post Deleted",
        description: "The post has been permanently removed.",
        variant: "destructive"
    });
  };

  // A helper component to render a styled badge based on the post's status.
  const getStatusBadge = (status: Post['status']) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200"><CheckCircle className="mr-1 h-3 w-3" />Published</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"><Send className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (userRole !== 'admin' && userRole !== 'editor') {
    return <div>You do not have permission to view this page.</div>;
  }

  // The JSX for the page layout.
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Posts</CardTitle>
          <CardDescription>Manage all blog posts, including drafts and submissions.</CardDescription>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Map over the posts array to render a table row for each post. */}
            {posts.map(post => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{getStatusBadge(post.status)}</TableCell>
                <TableCell>{getAuthorName(post)}</TableCell>
                <TableCell>
                  {isValid(new Date(post.updated_at))
                    ? format(new Date(post.updated_at), 'yyyy-MM-dd')
                    : 'Invalid date'}
                </TableCell>
                <TableCell className="text-right">
                    {/* The DropdownMenu component contains all actions for a single post. */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                               {/* Link to the dynamic edit page for this post. */}
                               <Link href={`/blog/admin/posts/edit/${post.id}`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                    <Eye className="mr-2 h-4 w-4" /> Preview
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {/* Role-based conditional rendering for actions. */}
                            {userRole === 'admin' && post.status !== 'published' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(post.id, 'published')}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Approve & Publish
                                </DropdownMenuItem>
                            )}
                            {/* Example of a disabled menu item if the user doesn't have permission. */}
                            {post.status === 'pending' && userRole !== 'admin' && (
                                <DropdownMenuItem disabled>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Admin required
                                </DropdownMenuItem>
                            )}
                             {post.status !== 'rejected' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(post.id, 'rejected')}>
                                    <XCircle className="mr-2 h-4 w-4" /> Reject
                                </DropdownMenuItem>
                             )}
                             {post.status !== 'draft' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(post.id, 'draft')}>
                                    <Archive className="mr-2 h-4 w-4" /> Move to Drafts
                                </DropdownMenuItem>
                             )}
                            {/* The delete action is only available to admins. */}
                            {userRole === 'admin' && (
                                <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:bg-red-100 focus:text-destructive" onClick={() => handleDelete(post.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
