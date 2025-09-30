// This file creates the main dashboard page for the admin area.
// It displays summary statistics and a list of recent pending submissions.

// This is a Client Component because it relies on data from the mock store, which can change
// based on user actions in other parts of the dashboard. In a real app with a database,
// this could be a Server Component if the data is fetched once on page load.
'use client';

// Import UI components from ShadCN.
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// Import icons.
import { Newspaper, MessageSquare, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// Import date formatting utility.
import { format } from "date-fns";
// Import the mock data. In a real application, these would be API calls.
import { mockPosts, mockUsers, mockComments, mockFollowUpStories } from '@/lib/mock-data';

// Helper function to get the author's name from their ID.
// This avoids duplicating logic and keeps the main component clean.
const getAuthorName = (authorId: string) => {
    const user = mockUsers.find(u => u.id === authorId);
    return user ? user.name : 'Unknown Author';
};

// The main component for the Admin Dashboard page.
export default function AdminDashboard() {
    // Filter the mock data to get the necessary statistics for the dashboard.
    // In a real app, this would be done with database queries.

    // Get all posts that are awaiting moderation.
    const pendingPosts = mockPosts.filter(p => p.status === 'pending');
    // Count the number of pending comments.
    const pendingCommentsCount = mockComments.filter(c => c.status === 'pending').length;
    // Count the number of pending follow-up stories.
    const pendingStoriesCount = mockFollowUpStories.filter(s => s.status === 'pending').length;

    // Consolidate all the dashboard data into a single object for easy access in the JSX.
    const dashboardData = {
        totalPosts: mockPosts.length,
        pendingPosts: pendingPosts.length,
        totalUsers: mockUsers.length,
        pendingComments: pendingCommentsCount,
        pendingStories: pendingStoriesCount,
        recentPendingPosts: pendingPosts.slice(0, 5) // Get the 5 most recent pending posts.
    };
  
  // The JSX that defines the structure of the dashboard.
  return (
    <div className="space-y-8">
      {/* Grid of summary statistic cards. */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Posts</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingComments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Stories</CardTitle>
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingStories}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Section for displaying recent pending posts. */}
      <div>
        <Card>
            <CardHeader>
                <CardTitle>Recent Pending Submissions</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Conditionally render the table if there are pending posts, otherwise show a message. */}
                {dashboardData.recentPendingPosts.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Map over the recent pending posts to create a row for each one. */}
                            {dashboardData.recentPendingPosts.map(post => (
                            <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>
                                        <Badge variant='secondary'>
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    {/* Use the helper function to display the author's name. */}
                                    <TableCell>{getAuthorName(post.authorId)}</TableCell>
                                    <TableCell>{format(new Date(post.created_at), 'yyyy-MM-dd')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    // This message is shown when the moderation queue is empty.
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No pending posts to review. Great job!</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
