// This component manages the "Join the Conversation" section on a blog post page.
// It includes the display of comments and follow-up stories, and provides modals for users to submit new content.

// This is a Client Component because it manages state (`useState`), handles user interactions,
// and depends on the client-side authentication context (`useAuth`).
'use client';

// Import React hooks.
import { useState, useEffect } from 'react';
// Import custom hooks for authentication and toasts.
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
// Import UI components.
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '../ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
// Import icons.
import { Paperclip, Send, X, MessageSquare, Pencil } from 'lucide-react';
// Import Next.js components.
import Image from 'next/image';
import Link from 'next/link';
// Import utilities and mock data.
import { format } from 'date-fns';
import { getComments, getStories, addComment, addStory, getUsers } from '@/lib/firestore';
import { Comment, FollowUpStory, User } from '@/lib/types';
import { uploadImage } from '@/lib/storage';

// The main component for the interactive section.
export function InteractiveSection({ articleId }: { articleId: string }) {
    // Get user authentication state.
    const { user, loading } = useAuth();
    // Use state to hold the comments and stories for the current article.
    // This allows the component to be dynamic and update if the data changes.
    const [comments, setComments] = useState<Comment[]>([]);
    const [stories, setStories] = useState<FollowUpStory[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    // This `useEffect` hook filters the mock data to get the relevant comments and stories for this article.
    // It runs whenever the `articleId` prop changes.
    useEffect(() => {
        async function fetchData() {
            const [comments, stories, users] = await Promise.all([getComments(articleId), getStories(articleId), getUsers()]);
            setComments(comments.filter(c => c.status === 'approved'));
            setStories(stories.filter(s => s.status === 'approved'));
            setUsers(users);
        }
        fetchData();
    }, [articleId]); // Dependency array.
    
    // Helper function to find a user's details by their ID from the mock data.
    const getUser = (userId: string) => users.find(u => u.id === userId);

    // This function is passed down to the submission modal. In a real app with live data,
    // it would be used to trigger a re-fetch of the comments/stories to update the UI.
    // For the mock setup, a toast is sufficient since new submissions are 'pending' and won't show here anyway.
    const onSubmission = () => {
        // A more complex implementation could show a "pending review" message in the UI.
    };

    // Show a loading state while the authentication status is being determined.
    if (loading) {
        return <p>Loading interactive section...</p>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold font-headline mb-8 text-center">Join the Conversation</h2>

            {/* If the user is not logged in, show a prompt to log in instead of the submission forms. */}
            {!user && (
                 <div className="text-center bg-card p-8 rounded-2xl">
                    <p className="mb-4 text-lg">You need to be logged in to comment or share your story.</p>
                    <Button asChild>
                        <Link href="/login">Login to Continue</Link>
                    </Button>
                </div>
            )}
            
            {/* The Accordion component is used to neatly contain the comments and stories sections. */}
            <Accordion type="multiple" className="w-full space-y-4">
                <AccordionItem value="comments" className="bg-card border-none rounded-2xl overflow-hidden shadow-lg">
                    <AccordionTrigger className="p-6 text-xl font-bold font-headline hover:no-underline">
                        <div className='flex items-center gap-3'>
                            <MessageSquare className="h-6 w-6" />
                            <span>Comments ({comments.length})</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <div className="space-y-6">
                            {/* Map over the approved comments and render them. */}
                            {comments.map(c => {
                                const author = getUser(c.userId);
                                return (
                                <div key={c.id} className="flex items-start gap-4">
                                    <Avatar>
                                        <AvatarImage src={author?.avatar} alt={author?.name} />
                                        <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="w-full">
                                        <div className="bg-secondary p-4 rounded-xl rounded-tl-none">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-bold">{author?.name}</p>
                                                <p className="text-xs text-muted-foreground">{format(c.created_at, 'MMM d, yyyy')}</p>
                                            </div>
                                            <p className="text-foreground/90">{c.comment_text}</p>
                                            {c.image_url && (
                                                <div className="mt-4 aspect-video relative rounded-lg overflow-hidden">
                                                    <Image src={c.image_url} alt="Comment image" fill className="object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                        {/* The submission modal is only rendered if the user is logged in. */}
                        {user && <SubmissionModal type="comment" articleId={articleId} onSubmission={onSubmission} />}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="stories" className="bg-card border-none rounded-2xl overflow-hidden shadow-lg">
                    <AccordionTrigger className="p-6 text-xl font-bold font-headline hover:no-underline">
                         <div className='flex items-center gap-3'>
                            <Pencil className="h-6 w-6" />
                            <span>Follow-up Stories ({stories.length})</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <div className="space-y-6">
                           {/* Map over the approved stories and render them. */}
                           {stories.map(story => {
                               const author = getUser(story.userId);
                               return (
                                <div key={story.id} className="flex items-start gap-4">
                                    <Avatar>
                                        <AvatarImage src={author?.avatar} alt={author?.name} />
                                        <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="w-full">
                                        <div className="bg-secondary p-4 rounded-xl rounded-tl-none">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-bold">{author?.name}</p>
                                                <p className="text-xs text-muted-foreground">{format(story.created_at, 'MMM d, yyyy')}</p>
                                            </div>
                                            <p className="text-foreground/90 whitespace-pre-wrap">{story.story_text}</p>
                                            {story.image_url && (
                                                <div className="mt-4 aspect-video relative rounded-lg overflow-hidden">
                                                    <Image src={story.image_url} alt="Story image" fill className="object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                         {/* The submission modal is only rendered if the user is logged in. */}
                         {user && <SubmissionModal type="story" articleId={articleId} onSubmission={onSubmission} />}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

// A reusable modal component for submitting both comments and stories.
function SubmissionModal({ type, articleId, onSubmission }: { type: 'comment' | 'story', articleId: string, onSubmission: () => void }) {
    const { user } = useAuth();
    const { toast } = useToast();
    // State for the form fields within the modal.
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [open, setOpen] = useState(false); // State to control the dialog's visibility.

    // Determine modal content based on the `type` prop.
    const isComment = type === 'comment';
    const charLimit = isComment ? 300 : 2000;
    const title = isComment ? 'Add a Comment' : 'Add Your Story';
    const description = isComment ? 'Share your thoughts on this article.' : 'Share a follow-up story with the community.';
    const buttonIcon = isComment ? <MessageSquare className="h-5 w-5 mr-2" /> : <Pencil className="h-5 w-5 mr-2" />;
    
    // Handler for image file selection.
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Create a temporary URL for preview.
        }
    };

    // Handler to remove a selected image.
    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    }

    // Handler for form submission.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !user) {
            toast({ title: 'Content cannot be empty.', variant: 'destructive' });
            return;
        }

        let imageUrl: string | undefined = undefined;

        if (image) {
            const path = `comments/${user.uid}/${image.name}`;
            imageUrl = await uploadImage(image, path);
        }

        // Call the appropriate mock data function based on the type.
        if (isComment) {

            const commentData: Omit<Comment, 'id'> = {
                postId: articleId,
                userId: user.uid,
                comment_text: content,
                status: 'pending',
                created_at: new Date()
            };

            if (imageUrl) {
                commentData.image_url = imageUrl;
            }

            await addComment(commentData);
        } else {
            const storyData: Omit<FollowUpStory, 'id'> = {
                postId: articleId,
                userId: user.uid,
                story_text: content,
                status: 'pending',
                created_at: new Date()
            };

            if (imageUrl) {
                storyData.image_url = imageUrl;
            }

            await addStory(storyData);
        }
        
        // Provide user feedback and reset the form.
        toast({
            title: 'Success!',
            description: `Your ${type} has been submitted for review.`,
        });

        onSubmission(); // Call the callback function from the parent.
        setContent('');
        setImage(null);
        setImagePreview(null);
        setOpen(false); // Close the dialog.
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mt-6 w-full" variant="outline">
                    {buttonIcon}
                    <span>{title}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid w-full gap-1.5">
                         <Label htmlFor="content">{isComment ? 'Comment' : 'Story'}</Label>
                         <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`Type your ${type} here...`}
                            id="content"
                            maxLength={charLimit}
                            className="min-h-[120px]"
                        />
                        <p className="text-sm text-muted-foreground text-right">{content.length} / {charLimit}</p>
                    </div>

                     {imagePreview && (
                        <div className="relative w-full h-32">
                            <Image src={imagePreview} alt="Image preview" fill className="rounded-md object-cover" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                onClick={handleRemoveImage}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                        <Button asChild variant="ghost" size="icon" className="cursor-pointer">
                            <label htmlFor="image-upload">
                                <Paperclip className="h-5 w-5" />
                                <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        </Button>
                        <DialogFooter>
                            <DialogClose asChild>
                               <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">
                                <Send className="mr-2 h-4 w-4" />
                                Post
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
