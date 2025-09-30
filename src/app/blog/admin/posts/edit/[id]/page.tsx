// This file creates the dynamic page for editing a specific blog post.
// The `[id]` in the folder name means this page will handle routes like `/blog/admin/posts/edit/post-1`.

// This must be a Client Component because it uses hooks (`useState`, `useEffect`, `useRouter`, `useParams`)
// to manage form state, handle user input, and respond to URL changes.
'use client';

// Import React hooks for state management and side effects.
import { useState, useEffect, ChangeEvent } from 'react';
// Import Next.js hooks for accessing the router and URL parameters.
import { useRouter, useParams } from 'next/navigation';
// Import UI components from ShadCN.
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// Import the mock data and the `updatePost` function to simulate database updates.
import { mockPosts, updatePost, Post } from '@/lib/mock-data';
// Import the hook for showing toast notifications.
import { useToast } from '@/hooks/use-toast';
// Import Next.js components for navigation and images.
import Link from 'next/link';
import Image from 'next/image';
// Import an icon.
import { ArrowLeft } from 'lucide-react';

// The main component for the Edit Post page.
export default function EditPostPage() {
  // Get the router instance for programmatic navigation (e.g., redirecting after save).
  const router = useRouter();
  // Get URL parameters. `params.id` will contain the ID of the post to edit.
  const params = useParams();
  const { id } = params;
  // Get the toast function for user feedback.
  const { toast } = useToast();
  
  // State to hold the full post object being edited.
  const [post, setPost] = useState<Post | null>(null);
  // State for each form field. This allows controlled components.
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  // State to hold the preview URL for a newly selected image file.
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // This `useEffect` hook runs when the component mounts or when the `id` parameter changes.
  // Its purpose is to fetch the post data and populate the form fields.
  useEffect(() => {
    // Find the post in the mock data array that matches the ID from the URL.
    const postToEdit = mockPosts.find(p => p.id === id);
    if (postToEdit) {
      // If the post is found, update the state.
      setPost(postToEdit);
      setTitle(postToEdit.title);
      setExcerpt(postToEdit.excerpt);
      setContent(postToEdit.content);
      setImagePreview(postToEdit.featured_img);
    } else {
      // If no post is found, show an error toast and redirect the user back to the main posts list.
      toast({
        title: "Post not found",
        description: "The post you are trying to edit does not exist.",
        variant: "destructive"
      });
      router.push('/blog/admin/posts');
    }
  }, [id, router, toast]); // Dependencies for the effect.

  // Handler for the file input change event.
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Check if a file was selected.
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        // In a real application, you would start the upload process here.
        // For this mock setup, we use `URL.createObjectURL` to generate a temporary local URL
        // for the selected file, allowing us to show a preview without an actual upload.
        setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handler for the form submission.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default browser form submission behavior.
    if (post) {
      // Call the `updatePost` function from our mock data library to "save" the changes.
      updatePost(post.id, {
        title,
        excerpt,
        content,
        featured_img: imagePreview || '', // Save the new image URL (or the old one if unchanged).
      });
      // Show a success notification.
      toast({
        title: "Post Updated",
        description: "The post has been saved successfully.",
      });
      // Redirect the user back to the list of posts.
      router.push('/blog/admin/posts');
    }
  };

  // While the post data is being loaded, show a simple loading message.
  if (!post) {
    return <div>Loading post...</div>;
  }

  // The JSX for the edit form.
  return (
    <div>
       <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/blog/admin/posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Link>
        </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
          <CardDescription>Make changes to your blog post here. Click save when you're done.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="featured_img">Featured Image</Label>
                    {/* Show a preview of the current featured image. */}
                    {imagePreview && (
                      <div className="mt-2 aspect-video relative rounded-md overflow-hidden">
                        <Image src={imagePreview} alt="Featured image preview" fill className="object-cover" />
                      </div>
                    )}
                    {/* The file input for uploading a new image. */}
                    <Input id="featured_img" type="file" onChange={handleImageChange} className="mt-2" accept="image/png, image/jpeg" />
                    <p className="text-sm text-muted-foreground mt-2">
                        Supports JPG, PNG. Max file size: 2MB. Recommended aspect ratio: 16:9.
                    </p>
                </div>
                <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[250px]" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button type="submit">Save Changes</Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
