// This file serves as a temporary, in-memory database for the application.
// It defines the data structures (types) and provides initial mock data for users,
// posts, comments, and stories. It also includes functions to manipulate this data,
// simulating C.R.U.D. (Create, Read, Update, Delete) operations.

// --- TYPE DEFINITIONS ---
// These types define the shape of the data objects used throughout the application.

export type User = {
  id: string; // Unique identifier (would be the UID from Firebase Auth).
  name: string;
  email: string;
  role: 'user' | 'editor' | 'admin'; // Role for controlling permissions.
  avatar?: string; // Optional URL for a profile picture.
  created_at: Date;
};

export type Post = {
  id: string;
  title: string;
  slug: string; // URL-friendly version of the title.
  content: string; // The full content of the post, can include HTML.
  excerpt: string; // A short summary.
  authorId: string; // The ID of the user who wrote the post.
  status: 'draft' | 'pending' | 'published' | 'rejected'; // The moderation status.
  featured_img: string; // URL for the main image.
  imageHint: string; // A hint for AI image tools.
  category: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;
};

export type Comment = {
  id: string;
  postId: string; // The ID of the post this comment belongs to.
  userId: string; // The ID of the user who wrote the comment.
  comment_text: string;
  image_url?: string; // Optional image attached to the comment.
  status: 'pending' | 'approved' | 'rejected'; // Moderation status.
  created_at: Date;
};

export type FollowUpStory = {
  id: string;
  postId: string;
  userId: string;
  story_text: string;
  image_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
};

// --- MOCK DATA ---
// Using `let` instead of `const` allows the data manipulation functions below to reassign the arrays.

// A list of mock users with different roles.
export let mockUsers: User[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@travonex.com', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=admin', created_at: new Date() },
  { id: 'user-2', name: 'Editor Erin', email: 'editor@travonex.com', role: 'editor', avatar: 'https://i.pravatar.cc/150?u=editor', created_at: new Date() },
  { id: 'user-3', name: 'Jane Doe', email: 'jane@example.com', role: 'user', avatar: 'https://i.pravatar.cc/150?u=jane', created_at: new Date() },
  { id: 'user-4', name: 'Alex Ray', email: 'alex@example.com', role: 'user', avatar: 'https://i.pravatar.cc/150?u=alex', created_at: new Date() },
];

// A list of mock blog posts with different statuses.
export let mockPosts: Post[] = [
  {
    id: 'post-1',
    title: 'A Weekend in the Mountains',
    slug: 'a-weekend-in-the-mountains',
    content: '<p>This is the full blog post content about a weekend in the mountains. It was a refreshing experience, full of nature and tranquility. We hiked, we explored, and we connected with the great outdoors.</p><p>The views were breathtaking, and the air was crisp and clean. Highly recommended for anyone looking to escape the city hustle.</p>',
    excerpt: 'A refreshing experience, full of nature and tranquility. We hiked, we explored, and we connected with the great outdoors.',
    authorId: 'user-3',
    status: 'published',
    featured_img: 'https://picsum.photos/seed/mountains/1200/600',
    imageHint: 'mountains landscape',
    category: 'Weekend Getaways',
    tags: ['hiking', 'nature', 'mountains'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    updated_at: new Date(),
  },
  {
    id: 'post-2',
    title: 'My Solo Trip to the East',
    slug: 'my-solo-trip-to-the-east',
    content: '<p>Content for the solo trip to the east. It was an amazing journey of self-discovery.</p>',
    excerpt: 'An amazing journey of self-discovery and cultural immersion in the far east.',
    authorId: 'user-4',
    status: 'pending',
    featured_img: 'https://picsum.photos/seed/solo-trip/1200/600',
    imageHint: 'solo travel',
    category: 'Adventure Travel',
    tags: ['solo', 'travel', 'asia'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    updated_at: new Date(),
  },
  {
    id: 'post-3',
    title: 'Hidden Gems of the Countryside',
    slug: 'hidden-gems-of-the-countryside',
    content: '<p>This is a draft about the hidden gems of the countryside. Still needs more work.</p>',
    excerpt: 'Exploring the quiet and beautiful places off the beaten path.',
    authorId: 'user-2',
    status: 'draft',
    featured_img: 'https://picsum.photos/seed/countryside/1200/600',
    imageHint: 'countryside landscape',
    category: 'Weekend Getaways',
    tags: ['countryside', 'nature', 'relax'],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'post-4',
    slug: 'exploring-the-urban-jungle',
    title: 'Exploring the Urban Jungle',
    content: '<p>City life has its own adventures. This post is about exploring the hidden gems of a bustling metropolis. From street art to unique cafes, there is always something new to discover.</p>',
    excerpt: 'City life has its own adventures. This post is about exploring the hidden gems of a bustling metropolis.',
    authorId: 'user-4',
    status: 'published',
    featured_img: 'https://picsum.photos/seed/city/1200/600',
    imageHint: 'city skyline',
    category: 'City Guides',
    tags: ['city', 'travel', 'urban'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    updated_at: new Date()
  }
];

// A list of mock comments.
export let mockComments: Comment[] = [
  { id: 'comment-1', postId: 'post-1', userId: 'user-4', comment_text: 'Great article! The mountain views look absolutely stunning.', status: 'approved', created_at: new Date() },
  { id: 'comment-2', postId: 'post-1', userId: 'user-2', comment_text: 'I really need to go there. Thanks for the inspiration!', status: 'pending', created_at: new Date() },
];

// A list of mock follow-up stories.
export let mockFollowUpStories: FollowUpStory[] = [
  { id: 'story-1', postId: 'post-1', userId: 'user-3', story_text: 'Inspired by this post, I went on my own mountain adventure. It was a transformative experience. The air was so fresh and the views were just breathtaking.', status: 'approved', image_url: 'https://picsum.photos/seed/story-hike/400/200', created_at: new Date() },
  { id: 'story-2', postId: 'post-1', userId: 'user-4', story_text: 'This is my follow up story, it is still pending approval.', status: 'pending', created_at: new Date() },
];

// --- DATA MUTATION FUNCTIONS ---
// These functions simulate database operations by directly modifying the mock data arrays.

// POSTS
// Simulates deleting a post from the database.
export function deletePost(postId: string) {
    mockPosts = mockPosts.filter(p => p.id !== postId);
}

// Simulates updating a post in the database.
export function updatePost(postId: string, updates: Partial<Post>) {
    mockPosts = mockPosts.map(p => 
        p.id === postId ? { ...p, ...updates, updated_at: new Date() } : p
    );
}

// COMMENTS
// Simulates adding a new comment to the database.
export function addComment(comment: Omit<Comment, 'id' | 'status' | 'created_at'>) {
    const newComment: Comment = {
        ...comment,
        id: `comment-${Date.now()}`, // Generate a unique ID.
        status: 'pending', // New comments always start as pending.
        created_at: new Date(),
    };
    mockComments.push(newComment);
    return newComment;
}

// Simulates deleting a comment.
export function deleteComment(commentId: string) {
    mockComments = mockComments.filter(c => c.id !== commentId);
}

// STORIES
// Simulates adding a new follow-up story.
export function addFollowUpStory(story: Omit<FollowUpStory, 'id' | 'status' | 'created_at'>) {
    const newStory: FollowUpStory = {
        ...story,
        id: `story-${Date.now()}`,
        status: 'pending',
        created_at: new Date(),
    };
    mockFollowUpStories.push(newStory);
    return newStory;
}

// Simulates deleting a follow-up story.
export function deleteFollowUpStory(storyId: string) {
    mockFollowUpStories = mockFollowUpStories.filter(s => s.id !== storyId);
}
