// This file creates the public-facing author page, e.g., /author/jane-d
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { getUserByUsername } from '@/lib/firestore';
import { Post, User } from '@/lib/types';

type AuthorPageProps = {
    author: User;
    posts: Post[];
}

function AuthorPageContent({ author, posts }: AuthorPageProps) {
     return (
        <div className="flex flex-col min-h-dvh bg-background">
            <Header />
            <main className="flex-1">
                {/* Author Header */}
                <section className="py-20 md:py-24 bg-secondary">
                    <div className="container mx-auto text-center">
                        <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-background shadow-lg">
                            <AvatarImage src={author.avatar} alt={author.name} />
                            <AvatarFallback className="text-4xl">{author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-4xl md:text-5xl font-extrabold font-headline">
                            {author.name}
                        </h1>
                        <p className="mt-2 text-muted-foreground">@{author.username}</p>
                        {author.bio && (
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
                                {author.bio}
                            </p>
                        )}
                    </div>
                </section>

                {/* Author's Posts */}
                <section className="py-24 md:py-32">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-bold font-headline mb-12 text-center">
                            Posts by {author.name}
                        </h2>
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {posts.map((post) => (
                                    <Link href={`/blog/${post.slug}`} key={post.slug}>
                                        <Card className="overflow-hidden h-full group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl border-none">
                                            <CardHeader className="p-0">
                                                {post.featuredImgUrl && (
                                                    <div className="aspect-video overflow-hidden">
                                                        <Image
                                                            src={post.featuredImgUrl}
                                                            alt={post.title}
                                                            width={600}
                                                            height={400}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            data-ai-hint={post.imageHint || 'travel landscape'}
                                                        />
                                                    </div>
                                                )}
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                                                <h3 className="text-xl font-bold font-headline group-hover:text-primary transition-colors">{post.title}</h3>
                                                <p className="mt-2 text-muted-foreground line-clamp-2">{post.excerpt}</p>
                                                 <div className="mt-4 text-sm text-muted-foreground">
                                                    <time dateTime={post.created_at.toISOString()}>{format(new Date(post.created_at), 'MMMM d, yyyy')}</time>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>{author.name} hasn't published any posts yet.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}


export default function AuthorPage() {
    const params = useParams();
    const username = params.username as string;

    const [author, setAuthor] = useState<User | null | undefined>(undefined);
    const [posts, setPosts] = useState<Post[]>([]);
    
    useEffect(() => {
        if (username) {
            getUserByUsername(username).then(data => {
                if (data) {
                    setAuthor(data.user);
                    setPosts(data.posts);
                } else {
                    setAuthor(null);
                }
            });
        }
    }, [username]);


    if (author === undefined) {
        return <div className="flex h-screen items-center justify-center">Loading author profile...</div>;
    }
    
    if (author === null) {
        notFound();
    }

    return <AuthorPageContent author={author} posts={posts} />;
}
