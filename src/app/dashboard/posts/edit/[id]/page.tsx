// This file creates the dynamic page for editing a specific blog post.
// The `[id]` in the folder name means this page will handle routes like /blog/admin/posts/edit/post-1.

'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { getPost, updatePost } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Post } from '@/lib/types';
import { uploadImage } from '@/lib/storage';

// Define the validation schema for the edit form.
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters." }).max(200, { message: "Excerpt cannot be more than 200 characters."}),
  content: z.string().min(50, { message: "Your story must be at least 50 characters long." }),
  image: z.any().optional(),
});

type ActionType = 'draft' | 'submit';

// The main component for the Edit Post page.
export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        excerpt: "",
        content: "",
    },
  });

  // This `useEffect` hook runs when the component mounts or when the `id` parameter changes.
  useEffect(() => {
    if (!id || !user) return;

    async function fetchPost(postId: string) {
      const postToEdit = await getPost(postId);
      if (postToEdit) {
        // Security check: ensure the current user is the author of the post.
        if(user && postToEdit.author_id !== user.uid) {
          toast({ title: "Access Denied", description: "You are not the author of this post.", variant: "destructive" });
          router.push('/dashboard');
          return;
        }
        setPost(postToEdit);
        form.reset({
            title: postToEdit.title,
            excerpt: postToEdit.excerpt,
            content: postToEdit.content,
        });
        setImagePreview(postToEdit.featuredImgUrl);
      } else {
        toast({
          title: "Post not found",
          description: "The post you are trying to edit does not exist.",
          variant: "destructive"
        });
        router.push('/dashboard');
      }
    }

    fetchPost(id);
  }, [id, router, toast, user, form]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }
  };

  async function handlePostUpdate(values: z.infer<typeof formSchema>, action: ActionType) {
    setIsLoading(true);
    
    let imageUrl = post?.featuredImgUrl;
    if (imageFile && user) {
        const path = `posts/${user.uid}/${imageFile.name}`;
        imageUrl = await uploadImage(imageFile, path);
    }

    // Determine the new status based on the button clicked.
    let newStatus: Post['status'] = post?.status || 'draft';
    if(action === 'submit' && (newStatus === 'draft' || newStatus === 'rejected')) {
        newStatus = 'pending';
    } else if (action === 'draft') {
        newStatus = 'draft';
    }
    
    if (post) {
      await updatePost(post.id, {
        ...values,
        status: newStatus,
        featuredImgUrl: imageUrl,
      });
      
      toast({
        title: action === 'submit' ? "Post Submitted" : "Draft Saved",
        description: action === 'submit' ? "Your post has been submitted for review." : "Your changes have been saved as a draft.",
      });
      
      router.push('/dashboard');
    }
    
    setIsLoading(false);
  }

  const onSubmit = (action: ActionType) => form.handleSubmit((values) => handlePostUpdate(values, action));

  if (!post) {
    return <div className="flex justify-center items-center h-screen">Loading post...</div>;
  }

  return (
    <div className="flex flex-col min-h-dvh bg-secondary/50">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-4xl">
           <Button variant="outline" size="sm" asChild className="mb-4">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <Form {...form}>
            <form>
                <Card>
                    <CardHeader>
                    <CardTitle>Edit Post</CardTitle>
                    <CardDescription>Make changes to your post here. Click save when you're done.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <Label htmlFor="title">Title</Label>
                                <FormControl>
                                    <Input id="title" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            <Label htmlFor="featuredImgUrl">Featured Image</Label>
                            {imagePreview && (
                              <div className="mt-2 aspect-video relative rounded-md overflow-hidden">
                                <Image src={imagePreview} alt="Featured image preview" fill className="object-cover" />
                              </div>
                            )}
                            <Input id="featuredImgUrl" type="file" onChange={handleImageChange} className="mt-2" accept="image/png, image/jpeg" />
                            <p className="text-sm text-muted-foreground mt-2">
                                Supports JPG, PNG. Max file size: 2MB. Recommended aspect ratio: 16:9.
                            </p>
                        </div>
                        <FormField
                            control={form.control}
                            name="excerpt"
                            render={({ field }) => (
                                <FormItem>
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <FormControl>
                                    <Textarea id="excerpt" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                <Label htmlFor="content">Content</Label>
                                <FormControl>
                                     <Textarea id="content" className="min-h-[250px]" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onSubmit('draft')} disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Draft"}
                        </Button>
                        <Button type="button" onClick={onSubmit('submit')} disabled={isLoading}>
                            {isLoading ? "Submitting..." : (post.status === 'pending' ? 'Resubmit for Review' : 'Submit for Review')}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
            </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
