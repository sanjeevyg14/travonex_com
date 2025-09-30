// This file creates the page where users can submit a new blog post for review.
// It contains a form for the title, excerpt, content, and a featured image.

// Import UI components.
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// Import layout components.
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

// Note: This is a simple presentational component. It doesn't use any hooks yet,
// but it would be converted to a 'use client' component to handle form state and submission.
export default function SubmitStoryPage() {
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
                {/* In a real application, this form would be managed by a library like `react-hook-form`. */}
                <form className="space-y-6">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder="e.g., My Amazing Trip to the Mountains" />
                    </div>
                     <div>
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea id="excerpt" placeholder="A short summary of your story..." />
                    </div>
                     <div>
                        <Label htmlFor="content">Your Story</Label>
                        <Textarea id="content" placeholder="Tell us all about it..." className="min-h-[200px]" />
                    </div>
                     <div>
                        <Label htmlFor="image">Featured Image</Label>
                        <Input id="image" type="file" />
                        <p className="text-sm text-muted-foreground mt-2">Upload a high-quality image for your story.</p>
                    </div>
                     <div className="flex justify-end">
                        {/* The `type="submit"` button would trigger the form's `onSubmit` handler. */}
                        <Button type="submit">Submit for Review</Button>
                    </div>
                </form>
            </CardContent>
           </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
