// This file creates the page where a user can edit their profile information.
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { ArrowLeft, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import Head from 'next/head';

// Define the validation schema for the profile form.
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters."})
    .regex(/^[a-z0-9-]+$/, { message: "Username can only contain lowercase letters, numbers, and hyphens."}),
  bio: z.string().max(160, { message: "Bio cannot be more than 160 characters." }).optional(),
});

export default function ProfilePage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user, updateUser, loading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.photoURL || null);

    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user?.name || "",
            username: user?.username || "",
            bio: user?.bio || "",
        },
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
        }
    };

    // This function handles the form submission.
    async function onSubmit(values: z.infer<typeof profileFormSchema>) {
        setIsLoading(true);

        try {
            await updateUser({
                ...values,
                avatar: avatarFile,
            });
            
            toast({
                title: "Profile Updated",
                description: "Your profile information has been saved.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "There was an error updating your profile.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }
    
    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!user) {
        router.push('/login');
        return null;
    }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
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
              <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Card>
                      <CardHeader>
                          <CardTitle>Edit Your Profile</CardTitle>
                          <CardDescription>This information will be displayed on your public author page.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                          <div className="flex items-center gap-6">
                              <div className="relative">
                                  <Avatar className="h-24 w-24">
                                      <AvatarImage src={avatarPreview || user.photoURL || undefined} alt={user.displayName || undefined}/>
                                      <AvatarFallback className="text-3xl">
                                          {user.displayName?.charAt(0)}
                                      </AvatarFallback>
                                  </Avatar>
                                  <Button asChild size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full cursor-pointer">
                                       <label htmlFor="avatar-upload">
                                          <Upload className="h-4 w-4" />
                                          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                       </label>
                                  </Button>
                              </div>
                              <div className='flex-1'>
                                  <h3 className="text-xl font-bold">{user.displayName}</h3>
                                  <p className="text-muted-foreground">@{user.username}</p>
                                  <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                                      <Link href={`/author/${user.username}`} target="_blank">View Public Profile</Link>
                                  </Button>
                              </div>
                          </div>

                          <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                  <FormItem>
                                  <Label htmlFor="username">Username</Label>
                                  <FormControl>
                                      <Input id="username" placeholder="your-unique-username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                  <FormItem>
                                  <Label htmlFor="name">Display Name</Label>
                                  <FormControl>
                                      <Input id="name" placeholder="Your Name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                          />
                           <FormField
                              control={form.control}
                              name="bio"
                              render={({ field }) => (
                                  <FormItem>
                                  <Label htmlFor="bio">Bio</Label>
                                  <FormControl>
                                       <Textarea id="bio" placeholder="Tell us a little about yourself..." className="min-h-[100px]" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                          />
                      </CardContent>
                      <CardFooter className="flex justify-end">
                          <Button type="submit" disabled={isLoading}>
                              {isLoading ? "Saving..." : "Save Changes"}
                          </Button>
                      </CardFooter>
                  </Card>
              </form>
             </Form>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
