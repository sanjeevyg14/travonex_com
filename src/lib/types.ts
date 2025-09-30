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
  featuredImgUrl: string; // URL for the main image.
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

export type EarlyAccessUser = {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
  userType: 'traveller' | 'organizer';
  created_at: Date;
};

export type NewsletterSubscriber = {
    id: string;
    email: string;
    created_at: Date;
};
