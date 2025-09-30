// This file represents the dynamic route for a single blog post page.
// The [slug] part in the filename indicates that it will match any URL like /blog/my-first-post.

// Import necessary functions and components from Next.js and other libraries.
import { notFound } from 'next/navigation'; // A Next.js function to trigger a 404 Not Found page.
import Image from 'next/image'; // The optimized Image component from Next.js.
import type { Metadata, ResolvingMetadata } from 'next'; // Types for defining page metadata for SEO.
import { Header } from '@/components/landing/header'; // The site's main header component.
import { Footer } from '@/components/landing/footer'; // The site's main footer component.
import { Badge } from '@/components/ui/badge'; // A UI component for displaying badges (e.g., for categories).
import { format } from 'date-fns'; // A utility library for formatting dates.
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // UI components for displaying user avatars.
import { Separator } from '@/components/ui/separator'; // A UI component for drawing a horizontal line.
import { Share2 } from 'lucide-react'; // An icon from the lucide-react library.
import { Button } from '@/components/ui/button'; // The standard button component.
import Link from 'next/link'; // The Next.js component for client-side navigation.
import { Card, CardContent, CardHeader } from '@/components/ui/card'; // UI components for card layouts.
import { InteractiveSection } from '@/components/blog/interactive-section'; // The component for comments and stories.
import { mockPosts, mockUsers } from '@/lib/mock-data'; // The mock data source for posts and users.


// An asynchronous function to retrieve a single blog post from the mock data based on its slug.
// In a real application, this would fetch data from a database.
async function getBlogPostBySlug(slug: string) {
    // Find the post in the `mockPosts` array where the slug matches the provided slug.
    const post = mockPosts.find(p => p.slug === slug);
    // If the post is not found or is not 'published', return null. This prevents drafts from being viewed publicly.
    if (!post || post.status !== 'published') {
        return null;
    }
    // Find the author of the post in the `mockUsers` array.
    const author = mockUsers.find(u => u.id === post.authorId);
    // Return the post data combined with the author's name and avatar.
    return { ...post, authorName: author?.name || 'Unknown', authorAvatar: author?.avatar };
}

// An asynchronous function to get a few related posts.
// This is based on the category of the current post, excluding the current post itself.
async function getRelatedPosts(categoryId: string | null, currentPostId: string) {
    // Filter `mockPosts` to find posts that are 'published', in the same category, and are not the current post.
    return mockPosts.filter(p => p.status === 'published' && p.category === categoryId && p.id !== currentPostId).slice(0, 3); // Limit to 3 related posts.
}

// Define the type for the props that this page component will receive from Next.js.
// `params` will contain the dynamic route parameters, in this case, the `slug`.
type Props = {
  params: { slug: string }
}

// `generateMetadata` is a special Next.js function that allows you to dynamically generate page metadata.
// This is crucial for SEO, as it sets the <title> and <meta> tags in the page's <head>.
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata // Access to metadata from parent layouts.
): Promise<Metadata> {
  // Fetch the post data using the slug from the URL parameters.
  const post = await getBlogPostBySlug(params.slug);

  // If the post is not found, return a default title.
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }
 
  // If the post is found, return detailed metadata for better SEO.
  return {
    title: `${post.title} – Travonex Insights`,
    description: `Read ${post.title} on Travonex for expert insights, stories, and community discussions.`,
    // Open Graph metadata is used for social media sharing (e.g., Facebook, LinkedIn).
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featured_img], // The main image for the social media preview.
    },
  }
}

// This is the main React component for the blog post page. It's an async component,
// allowing it to fetch data directly on the server before rendering.
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Fetch the specific blog post based on the slug from the URL.
  const post = await getBlogPostBySlug(params.slug);

  // If `getBlogPostBySlug` returns null (post not found or not published), trigger a 404 page.
  if (!post) {
    notFound();
  }

  // Fetch related posts to display at the bottom of the page.
  const relatedPosts = await getRelatedPosts(post.category, post.id);

  // The JSX that defines the structure of the page.
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        {/* The main article content. */}
        <article className="container max-w-4xl mx-auto py-12 md:py-24">
          <header className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tight text-foreground">
              {post.title}
            </h1>
            <div className="mt-6 flex justify-center items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-3">
                 <Avatar>
                  <AvatarImage src={post.authorAvatar || undefined} alt={post.authorName} />
                  <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{post.authorName}</span>
              </div>
              <span>•</span>
              <time dateTime={post.created_at.toISOString()}>{format(new Date(post.created_at), 'MMMM d, yyyy')}</time>
            </div>
          </header>

          {/* Display the featured image if it exists. */}
          {post.featured_img && (
            <div className="aspect-video relative mb-12 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={post.featured_img}
                  alt={post.title}
                  fill // The `fill` prop makes the image cover its parent container.
                  className="object-cover"
                  data-ai-hint={post.imageHint || 'travel landscape'} // A hint for AI image tools.
                />
            </div>
          )}

          {/* The main content of the post. `dangerouslySetInnerHTML` is used here because the mock
              content contains HTML tags. In a real app with a CMS, this is a common pattern, but
              it's crucial to ensure the HTML is sanitized to prevent XSS attacks. */}
          <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-foreground/90 text-lg" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
          
          <Separator className="my-12" />

          {/* Footer of the article, showing tags and a share button. */}
          <footer className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </footer>
        </article>
        
        {/* The interactive section for comments and stories. */}
        <section className="py-16 bg-secondary/50">
          <div className="container max-w-4xl mx-auto">
             <InteractiveSection articleId={post.id} />
          </div>
        </section>

        {/* The section for related posts, only shown if there are any. */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold font-headline text-center mb-12">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.slug}>
                    <Card className="overflow-hidden h-full group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl border-none">
                      <CardHeader className="p-0">
                         {relatedPost.featured_img && (
                            <div className="aspect-video overflow-hidden">
                                <Image
                                src={relatedPost.featured_img}
                                alt={relatedPost.title}
                                width={600}
                                height={400}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                data-ai-hint={relatedPost.imageHint || 'travel landscape'}
                                />
                            </div>
                         )}
                      </CardHeader>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold font-headline group-hover:text-primary transition-colors">{relatedPost.title}</h3>
                        <p className="mt-2 text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
}
