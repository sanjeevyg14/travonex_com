// This file creates the page for moderating user-submitted follow-up stories in the admin dashboard.
// It's very similar in structure and function to the comments moderation page.

// This is a Client Component because it uses `useState` for state management and handles user interactions.
'use client';

// Import React hooks and UI components.
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
// Import mock data and types.
import { FollowUpStory, User, Post } from '@/lib/types';
import { getStories, getUsers, getPosts, updateStory, deleteStory as deleteStoryFromFirestore } from '@/lib/firestore';
// Import icons for action buttons.
import { ThumbsUp, ThumbsDown, Trash2, CheckCircle, XCircle, Send } from 'lucide-react';
// Import Next.js components.
import Link from 'next/link';
// Import custom hooks.
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// The main component for the Admin Stories Page.
export default function AdminStoriesPage() {
  // State to hold the list of stories, allowing for reactive UI updates.
  const [stories, setStories] = useState<FollowUpStory[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  // Get user role for permission checks.
  const { userRole } = useAuth();
  // Get the toast function for user feedback.
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
        const [stories, users, posts] = await Promise.all([getStories(), getUsers(), getPosts()]);
        setStories(stories);
        setUsers(users);
        setPosts(posts);
    }
    fetchData();
  }, []);

  // Helper function to find user information by ID.
  const getUserInfo = (userId: string) => users.find(u => u.id === userId) || { name: 'Unknown', avatar: '' };

    // Helper function to find post information by ID.
    const getPostInfo = (postId: string) => posts.find(p => p.id === postId) || { title: 'Unknown Post', slug: '#' };

  // Handler to change the status of a story.
  const handleStatusChange = async (storyId: string, newStatus: FollowUpStory['status']) => {
    await updateStory(storyId, { status: newStatus });
    // Update the state by mapping over the stories array.
    setStories(stories.map(s => 
      s.id === storyId ? { ...s, status: newStatus } : s
    ));
    // Show a success toast.
    toast({
        title: "Story Updated",
        description: `The story has been ${newStatus}.`
    });
  };
  
  // Handler to delete a story.
  const handleDelete = async (storyId: string) => {
      await deleteStoryFromFirestore(storyId);
      // Update state by filtering out the deleted story.
      setStories(stories.filter(s => s.id !== storyId));
      // Show a destructive toast.
      toast({
        title: "Story Deleted",
        description: "The story has been permanently removed.",
        variant: "destructive"
    });
  }

  // A helper component to render the correct status badge.
  const getStatusBadge = (status: FollowUpStory['status']) => {
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

  // The JSX for the page layout.
  return (
    <Card>
      <CardHeader>
        <CardTitle>Moderate Follow-up Stories</CardTitle>
        <CardDescription>Approve or reject stories submitted by users.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Story Excerpt</TableHead>
              <TableHead>In Response To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Map over the stories array to render a row for each one. */}
            {stories.map(story => {
              const author = getUserInfo(story.userId);
              const post = getPostInfo(story.postId);
              return (
                <TableRow key={story.id}>
                  <TableCell className="font-medium">{author.name}</TableCell>
                  {/* `truncate` and `max-w-xs` are Tailwind classes to prevent long text from breaking the layout. */}
                  <TableCell className="text-muted-foreground truncate max-w-xs">{story.story_text}</TableCell>
                  <TableCell>
                    {/* Link to the original post for context. */}
                    <Link href={`/blog/${post.slug}`} className="hover:underline" target="_blank">
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(story.status)}
                  </TableCell>
                  <TableCell>{format(new Date(story.created_at), 'yyyy-MM-dd')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                        {/* Conditionally render the 'Approve' button. */}
                        {story.status !== 'approved' && (
                            <Button variant="outline" size="icon" title="Approve" onClick={() => handleStatusChange(story.id, 'approved')}>
                                <ThumbsUp className="h-4 w-4 text-green-600" />
                            </Button>
                        )}
                        {/* Conditionally render the 'Reject' button. */}
                        {story.status !== 'rejected' && (
                            <Button variant="outline" size="icon" title="Reject" onClick={() => handleStatusChange(story.id, 'rejected')}>
                                <ThumbsDown className="h-4 w-4 text-red-600" />
                            </Button>
                        )}
                        {/* Only admins can see the 'Delete' button. */}
                        {userRole === 'admin' && (
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-red-100" title="Delete" onClick={() => handleDelete(story.id)}>
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
