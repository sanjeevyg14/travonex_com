'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Newspaper, MessageSquare, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Post, User, Comment, FollowUpStory } from '@/lib/types';

const getAuthorName = (authorId: string, users: User[]) => {
    const user = users.find(u => u.id === authorId);
    return user ? user.name : 'Unknown Author';
};

export default function AdminDashboard() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [stories, setStories] = useState<FollowUpStory[]>([]);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            const postsQuery = query(collection(db, 'posts'));
            const postsSnapshot = await getDocs(postsQuery);
            const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
            setPosts(postsData);

            const usersQuery = query(collection(db, 'users'));
            const usersSnapshot = await getDocs(usersQuery);
            const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
            setUsers(usersData);

            const commentsQuery = query(collection(db, 'comments'));
            const commentsSnapshot = await getDocs(commentsQuery);
            const commentsData = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[];
            setComments(commentsData);

            const storiesQuery = query(collection(db, 'stories'));
            const storiesSnapshot = await getDocs(storiesQuery);
            const storiesData = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FollowUpStory[];
            setStories(storiesData);
        };

        fetchData();
    }, [user]);

    const pendingPosts = posts.filter(p => p.status === 'pending');
    const pendingCommentsCount = comments.filter(c => c.status === 'pending').length;
    const pendingStoriesCount = stories.filter(s => s.status === 'pending').length;

    const dashboardData = {
        totalPosts: posts.length,
        pendingPosts: pendingPosts.length,
        totalUsers: users.length,
        pendingComments: pendingCommentsCount,
        pendingStories: pendingStoriesCount,
        recentPendingPosts: pendingPosts.slice(0, 5)
    };
  
  return (
    <div className="space-y-8">
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
      
      <div>
        <Card>
            <CardHeader>
                <CardTitle>Recent Pending Submissions</CardTitle>
            </CardHeader>
            <CardContent>
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
                            {dashboardData.recentPendingPosts.map(post => (
                            <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>
                                        <Badge variant='secondary'>
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{getAuthorName(post.authorId, users)}</TableCell>
                                    <TableCell>{format(new Date(post.created_at), 'yyyy-MM-dd')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
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
