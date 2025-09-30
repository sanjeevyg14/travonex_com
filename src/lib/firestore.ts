// This file contains helper functions for interacting with the Firestore database.
// It centralizes all the database logic, making it easier to manage and reuse across the application.

import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "./firebase";

// --- TYPE DEFINITIONS ---
// These types define the data structures for our Firestore collections.
// Having these ensures type safety when we read from and write to the database.

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'editor' | 'admin';
  createdAt: any; // Using `any` for serverTimestamp flexibility
};

export type Post = {
  id?: string; // The document ID is optional, as it's not present on new documents.
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  featuredImgUrl: string;
  createdAt: any;
  updatedAt: any;
};

export type Comment = {
  id?: string;
  postId: string;
  userId: string;
  commentText: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
};

export type Story = {
  id?: string;
  postId: string;
  userId: string;
  storyText: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
};


// --- POST FUNCTIONS ---

/**
 * Fetches all posts, optionally filtering by status.
 * @param {string} [status] - Optional status to filter posts by (e.g., 'published', 'pending').
 * @returns {Promise<Post[]>} A promise that resolves to an array of posts.
 */
export async function getPosts(status?: Post['status']): Promise<Post[]> {
  const postsRef = collection(db, "posts");
  let q;

  if (status) {
    q = query(postsRef, where("status", "==", status), orderBy("createdAt", "desc"));
  } else {
    q = query(postsRef, orderBy("createdAt", "desc"));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
}

/**
 * Fetches a single post by its URL slug.
 * @param {string} slug - The URL-friendly slug of the post.
 * @returns {Promise<Post | null>} A promise that resolves to the post object or null if not found.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Post;
}


/**
 * Updates the status of a specific post.
 * @param {string} postId - The ID of the post to update.
 * @param {string} status - The new status to set.
 */
export async function updatePostStatus(postId: string, status: Post['status']) {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    status: status,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletes a post from the database.
 * @param {string} postId - The ID of the post to delete.
 */
export async function deletePost(postId: string) {
  const postRef = doc(db, "posts", postId);
  await deleteDoc(postRef);
}


// --- COMMENT FUNCTIONS ---

/**
 * Adds a new comment to a post.
 * @param {string} postId - The ID of the post being commented on.
 * @param {string} userId - The ID of the user submitting the comment.
 * @param {string} commentText - The content of the comment.
 * @param {string} [imageUrl] - Optional URL of an image attached to the comment.
 */
export async function addComment(postId: string, userId: string, commentText: string, imageUrl?: string) {
  await addDoc(collection(db, "comments"), {
    postId,
    userId,
    commentText,
    imageUrl: imageUrl || null,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

/**
 * Updates a comment's status to 'approved'.
 * @param {string} commentId - The ID of the comment to approve.
 */
export async function approveComment(commentId: string) {
    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, { status: 'approved' });
}

/**
 * Updates a comment's status to 'rejected'.
 * @param {string} commentId - The ID of the comment to reject.
 */
export async function rejectComment(commentId: string) {
    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, { status: 'rejected' });
}


// --- STORY FUNCTIONS ---

/**
 * Adds a new follow-up story to a post.
 * @param {string} postId - The ID of the related post.
 * @param {string} userId - The ID of the user submitting the story.
 * @param {string} storyText - The content of the story.
 * @param {string} [imageUrl] - Optional URL of an image attached to the story.
 */
export async function addStory(postId: string, userId: string, storyText: string, imageUrl?: string) {
  await addDoc(collection(db, "stories"), {
    postId,
    userId,
    storyText,
    imageUrl: imageUrl || null,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}
