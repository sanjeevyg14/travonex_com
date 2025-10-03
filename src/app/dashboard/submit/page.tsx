// This file creates the page where users can submit a new blog post for review.
// It contains a form for the title, excerpt, content, and a featured image.
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/use-auth';
import { addPost } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/lib/storage';
import Image from 'next/image';
import { useState } from 'react';

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    excerpt: z.string().min(1, "Excerpt is required"),
    content: z.string().min(1, "Content is required"),
    image: z.any().optional(),
});

export default function SubmitStoryPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            excerpt: "",
            content: "",
            image: undefined,
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            toast({
                title: "Error",
                description: "You must be logged in to submit a story.",
                variant: "destructive",
            });
            return;
        }

        try {
            let imageUrl = '';
            if (values.image && values.image[0]) {
                const file = values.image[0];
                const path = `posts/${user.uid}/${file.name}`;
                imageUrl = await uploadImage(file, path);
            }

            // Construct the post object without the 'image' field from the form values.
            const postData = {
                title: values.title,
                excerpt: values.excerpt,
                content: values.content,
                author_id: user.uid,
                status: 'pending' as const,
                slug: values.title.toLowerCase().replace(/\s+/g, '-'),
                featuredImgUrl: imageUrl,
                imageHint: '',
                category: '',
                tags: [],
                created_at: new Date(),
                updated_at: new Date(),
            };

            await addPost(postData);

            toast({
                title: "Success",
                description: "Your story has been submitted for review.",
            });

            router.push('/dashboard');
        } catch (error) {
            console.error("Error submitting story: ", error);
            toast({
                title: "Error",
                description: "Something went wrong. Please check the console for details.",
                variant: "destructive",
            });
        }
    }

  return (
     <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container max-w-4xl">
           <Card>
            <CardHeader>
                <CardTitle>Submit Your Travel Story</CardTitle>
                <CardDescription>Share your adventures with the Travonex community.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Title</Label>
                                    <FormControl>
                                        <Input placeholder="e.g., My Amazing Trip to the Mountains" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="excerpt"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Excerpt</Label>
                                    <FormControl>
                                        <Textarea placeholder="A short summary of your story..." {...field} />
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
                                    <Label>Your Story</Label>
                                    <FormControl>
                                        <Textarea placeholder="Tell us all about it..." className="min-h-[200px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field: { onChange, onBlur, name, ref } }) => (
                                <FormItem>
                                    <Label>Featured Image</Label>
                                    <FormControl>
                                        <Input 
                                            type="file" 
                                            name={name}
                                            ref={ref}
                                            onBlur={onBlur}
                                            onChange={(e) => {
                                                onChange(e.target.files);
                                                handleImageChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {imagePreview && (
                            <Image src={imagePreview} alt="Image preview" width={200} height={200} />
                        )}
                        <div className="flex justify-end">
                            <Button type="submit">Submit for Review</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
           </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
