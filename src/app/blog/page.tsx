// This file is the main page for the blog, displaying a list of all published posts.
// It includes a hero section, a search bar, and the grid of post cards.

// This is a Client Component because it uses hooks (`useState`, `useEffect`, `useSearchParams`)
// to handle client-side searching and to react to the user's authentication state.
'use client';

// Import React hooks.
import { useEffect, useState } from 'react';
// Import Next.js components and hooks.
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
// Import site-wide layout components.
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
// Import UI components from ShadCN.
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Import other components used on this page.
import { NewsletterSignup } from '@/components/blog/newsletter-signup';
// Import icons.
import { Search, LogIn, PlusCircle, LayoutDashboard, Newspaper, LogOut } from 'lucide-react';
// Import date formatting utility.
import { format } from 'date-fns';
// Import custom authentication hook.
import { useAuth } from '@/hooks/use-auth';
// Import Firestore functions.
import { getPublishedPosts, getUsers } from '@/lib/firestore';
import { Post, User } from '@/lib/types';

// The main component for the Blog Index Page.
export default function BlogIndexPage() {
  // Hook to get URL search parameters. Used for the search functionality.
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  
  // State to hold the posts that are currently displayed on the page.
  // This can be the full list or a filtered list based on the search term.
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  // Get user authentication status and functions from the custom `useAuth` hook.
  const { user, loading, logout, userRole } = useAuth();
  // Get the router instance for programmatic navigation.
  const router = useRouter();
  
  useEffect(() => {
    async function fetchData() {
      const [posts, users] = await Promise.all([getPublishedPosts(), getUsers()]);
      setPosts(posts);
      setUsers(users);
    }
    fetchData();
  }, []);

  // Helper function to get an author's name from their ID.
  const getAuthorName = (authorId: string) => {
      const user = users.find(u => u.id === authorId);
      return user ? user.name : 'Unknown Author';
  };

  // This `useEffect` hook handles the search functionality.
  // It runs whenever the `searchTerm` from the URL changes.
  useEffect(() => {
    if (searchTerm) {
      // If there is a search term, filter the `publishedPosts` array.
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      // If the search term is empty, show all published posts.
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]); // The effect depends on the `searchTerm`.
  
  // Handler for the "Add Your Story" button.
  // It checks if the user is logged in before redirecting.
  const handleAddStoryClick = () => {
      if (user) {
          // If logged in, go to the submission page.
          router.push('/dashboard/submit');
      } else {
          // If not logged in, go to the login page.
          router.push('/login');
      }
  };

  // The JSX for the page layout.
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        {/* The hero section at the top of the blog page. */}
        <section className="relative py-20 md:py-32 text-white overflow-hidden">
           <div className="absolute inset-0">
            <Image
              src="https://picsum.photos/seed/travel-hero/1920/1080"
              alt="Scenic travel destination background"
              fill
              className="object-cover"
              data-ai-hint="travel background"
            />
            <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay for text readability */}
          </div>
          <div className="container relative z-10 mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tight">
              Travonex Blog
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90">
              Travel stories, tips, and inspiration from our community and team.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
               {/* This block handles the display of the user/login button based on auth state. */}
               {loading ? (
                 // While loading, show a skeleton placeholder.
                 <div className="h-12 w-48 bg-gray-500/50 rounded-2xl animate-pulse" />
               ) : user ? (
                 // If the user is logged in, show a dropdown menu with their profile info.
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-12 px-4 rounded-2xl text-white hover:bg-white/10 hover:text-white">
                            <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.displayName || user.email}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* Conditionally show a link to the Admin Dashboard for admins/editors. */}
                        {userRole === 'admin' || userRole === 'editor' ? (
                            <DropdownMenuItem asChild>
                                <Link href="/blog/admin">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>Admin Dashboard</span>
                                 </Link>
                            </DropdownMenuItem>
                        ) : (
                             // Regular users see a link to their personal dashboard.
                             <DropdownMenuItem asChild>
                                <Link href="/dashboard">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>My Dashboard</span>
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                        <Link href="/dashboard/submit">
                                <Newspaper className="mr-2 h-4 w-4" />
                                <span>Submit Story</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => logout()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
               ) : (
                // If the user is not logged in, show the Login / Sign Up button.
                <Button size="lg" className="rounded-2xl font-bold hover:scale-105 transition-transform" asChild>
                  <Link href="/login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Login / Sign Up
                  </Link>
                </Button>
               )}
               <Button size="lg" variant="outline" className="rounded-2xl font-bold bg-white/90 text-foreground hover:bg-white transition-transform hover:scale-105" onClick={handleAddStoryClick}>
                 <PlusCircle className="mr-2 h-5 w-5" />
                 Add Your Story
               </Button>
            </div>
            <p className="mt-4 text-white/80 italic text-sm">Share your travel stories with the world!</p>
            {/* The search form. */}
            <div className="mt-10 max-w-2xl mx-auto">
              <form>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    name="search"
                    placeholder="Search for articles..."
                    className="w-full rounded-2xl p-6 pl-12 text-lg bg-white/90 text-foreground placeholder:text-muted-foreground focus:bg-white"
                    defaultValue={searchTerm}
                  />
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* The main content section displaying the grid of blog posts. */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto">
             {/* Conditionally render the posts grid or a "No Posts Found" message. */}
             {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
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
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{post.category}</Badge>
                        </div>
                        <h2 className="text-xl font-bold font-headline group-hover:text-primary transition-colors">{post.title}</h2>
                        <p className="mt-2 text-muted-foreground line-clamp-3">{post.excerpt}</p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{getAuthorName(post.author_id || (post as any).authorId)}</span>
                            <span>•</span>
                            <time dateTime={post.created_at.toISOString()}>{format(new Date(post.created_at), 'MMMM d, yyyy')}</time>
                        </div>
                        </CardContent>
                    </Card>
                    </Link>
                ))}
                </div>
             ) : (
                // This message is shown when a search yields no results.
                <div className="text-center">
                    <h2 className="text-2xl font-bold">No Posts Found</h2>
                    <p className="mt-4 text-muted-foreground">Try adjusting your search term or check back later!</p>
                </div>
             )}
          </div>
        </section>

        {/* The newsletter signup section. */}
        <section className="pb-24 md:pb-32">
            <div className="container mx-auto">
                <NewsletterSignup />
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
