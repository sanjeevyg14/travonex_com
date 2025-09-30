// This file will contain all the functions to interact with the Firestore database.
// It will replace the mock data functions in `src/lib/mock-data.ts`.

import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, Timestamp, serverTimestamp, query, where, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { User, Post, Comment, FollowUpStory, EarlyAccessUser, NewsletterSubscriber } from './types';

// --- TYPE CONVERTERS ---
// Firestore converters are used to ensure that the data being sent to and received from Firestore
// is correctly typed. This is especially important for handling Timestamps.

const postConverter = {
  toFirestore: (post: Omit<Post, 'id'>) => {
    return {
      ...post,
      created_at: post.created_at instanceof Date ? Timestamp.fromDate(post.created_at) : serverTimestamp(),
      updated_at: post.updated_at instanceof Date ? Timestamp.fromDate(post.updated_at) : serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Post => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
      created_at: data.created_at instanceof Timestamp ? data.created_at.toDate() : new Date(),
      updated_at: data.updated_at instanceof Timestamp ? data.updated_at.toDate() : new Date(),
    } as Post;
  }
};

const commentConverter = {
    toFirestore: (comment: Omit<Comment, 'id'>) => {
        return {
            ...comment,
            created_at: comment.created_at instanceof Date ? Timestamp.fromDate(comment.created_at) : serverTimestamp(),
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Comment => {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            ...data,
            created_at: data.created_at?.toDate() || new Date(),
        } as Comment;
    }
};

const storyConverter = {
    toFirestore: (story: Omit<FollowUpStory, 'id'>) => {
        return {
            ...story,
            created_at: story.created_at instanceof Date ? Timestamp.fromDate(story.created_at) : serverTimestamp(),
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): FollowUpStory => {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            ...data,
            created_at: data.created_at?.toDate() || new Date(),
        } as FollowUpStory;
    }
};

const userConverter = {
    toFirestore: (user: Omit<User, 'id'>) => {
        return {
            ...user,
            created_at: user.created_at instanceof Date ? Timestamp.fromDate(user.created_at) : serverTimestamp(),
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User => {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            ...data,
            created_at: data.created_at?.toDate() || new Date(),
        } as User;
    }
};

const earlyAccessUserConverter = {
    toFirestore: (user: Omit<EarlyAccessUser, 'id'>) => {
        return {
            ...user,
            created_at: serverTimestamp(),
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): EarlyAccessUser => {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            ...data,
            created_at: data.created_at?.toDate() || new Date(),
        } as EarlyAccessUser;
    }
};

const newsletterSubscriberConverter = {
    toFirestore: (subscriber: Omit<NewsletterSubscriber, 'id'>) => {
        return {
            ...subscriber,
            created_at: serverTimestamp(),
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): NewsletterSubscriber => {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            ...data,
            created_at: data.created_at?.toDate() || new Date(),
        } as NewsletterSubscriber;
    }
};

// --- POSTS ---

// Fetches all posts from Firestore.
export async function getPosts(): Promise<Post[]> {
  const postsCol = collection(db, 'posts').withConverter(postConverter);
  const postSnapshot = await getDocs(postsCol);
  const postList = postSnapshot.docs.map(doc => doc.data() as Post);
  return postList;
}

// Fetches all published posts from Firestore.
export async function getPublishedPosts(): Promise<Post[]> {
    const postsCol = collection(db, 'posts').withConverter(postConverter);
    const q = query(postsCol, where('status', '==', 'published'));
    const postSnapshot = await getDocs(q);
    const postList = postSnapshot.docs.map(doc => doc.data() as Post);
    return postList;
}

// Fetches a single post by its slug.
export async function getPostsBySlug(slug: string): Promise<Post | null> {
    const postsCol = collection(db, 'posts').withConverter(postConverter);
    const q = query(postsCol, where('slug', '==', slug), where('status', '==', 'published'));
    const postSnapshot = await getDocs(q);
    if (postSnapshot.empty) {
        return null;
    }
    return postSnapshot.docs[0].data() as Post;
}

// Fetches a single post by its ID.
export async function getPost(id: string): Promise<Post | null> {
  const postDocRef = doc(db, 'posts', id).withConverter(postConverter);
  const postSnap = await getDoc(postDocRef);
  if (postSnap.exists()) {
    return postSnap.data() as Post;
  } else {
    return null;
  }
}

// Adds a new post to Firestore.
export async function addPost(post: Omit<Post, 'id'>): Promise<string> {
  const postsCol = collection(db, 'posts').withConverter(postConverter);
  const docRef = await addDoc(postsCol, post);
  return docRef.id;
}

// Updates a post in Firestore.
export async function updatePost(id: string, updates: Partial<Post>): Promise<void> {
  const postDocRef = doc(db, 'posts', id);
  await updateDoc(postDocRef, {
    ...updates,
    updated_at: serverTimestamp()
  });
}

// Deletes a post from Firestore.
export async function deletePost(id: string): Promise<void> {
  const postDocRef = doc(db, 'posts', id);
  await deleteDoc(postDocRef);
}

// --- COMMENTS ---

// Fetches all comments for a given post.
export async function getComments(postId?: string): Promise<Comment[]> {
    const commentsCol = collection(db, 'comments').withConverter(commentConverter);
    const q = postId ? query(commentsCol, where('postId', '==', postId)) : commentsCol;
    const commentSnapshot = await getDocs(q);
    const commentList = commentSnapshot.docs.map(doc => doc.data() as Comment);
    return commentList;
}

// Adds a new comment.
export async function addComment(comment: Omit<Comment, 'id'>): Promise<string> {
    const commentsCol = collection(db, 'comments').withConverter(commentConverter);
    const docRef = await addDoc(commentsCol, comment);
    return docRef.id;
}

// Updates a comment in Firestore.
export async function updateComment(id: string, updates: Partial<Comment>): Promise<void> {
    const commentDocRef = doc(db, 'comments', id);
    await updateDoc(commentDocRef, updates);
}

// Deletes a comment.
export async function deleteComment(id: string): Promise<void> {
    const commentDocRef = doc(db, 'comments', id);
    await deleteDoc(commentDocRef);
}


// --- STORIES ---

// Fetches all stories for a given post.
export async function getStories(postId?: string): Promise<FollowUpStory[]> {
    const storiesCol = collection(db, 'stories').withConverter(storyConverter);
    const q = postId ? query(storiesCol, where('postId', '==', postId)) : storiesCol;
    const storySnapshot = await getDocs(q);
    const storyList = storySnapshot.docs.map(doc => doc.data() as FollowUpStory);
    return storyList;
}

// Adds a new story.
export async function addStory(story: Omit<FollowUpStory, 'id'>): Promise<string> {
    const storiesCol = collection(db, 'stories').withConverter(storyConverter);
    const docRef = await addDoc(storiesCol, story);
    return docRef.id;
}

// Updates a story in Firestore.
export async function updateStory(id: string, updates: Partial<FollowUpStory>): Promise<void> {
    const storyDocRef = doc(db, 'stories', id);
    await updateDoc(storyDocRef, updates);
}

// Deletes a story.
export async function deleteStory(id: string): Promise<void> {
    const storyDocRef = doc(db, 'stories', id);
    await deleteDoc(storyDocRef);
}


// --- USERS ---

// Fetches all users.
export async function getUsers(): Promise<User[]> {
    const usersCol = collection(db, 'users').withConverter(userConverter);
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => doc.data() as User);
    return userList;
}

// Fetches a single user by their ID.
export async function getUserById(id: string): Promise<User | null> {
    const userDocRef = doc(db, 'users', id).withConverter(userConverter);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
        return userSnap.data() as User;
    } else {
        return null;
    }
}

// --- EARLY ACCESS USERS ---

// Adds a new early access user to Firestore.
export async function addEarlyAccessUser(user: Omit<EarlyAccessUser, 'id'>): Promise<string> {
    const earlyAccessUsersCol = collection(db, 'early_access_users').withConverter(earlyAccessUserConverter);
    const docRef = await addDoc(earlyAccessUsersCol, user);
    return docRef.id;
}

// --- NEWSLETTER SUBSCRIBERS ---

// Adds a new newsletter subscriber to Firestore.
export async function addNewsletterSubscriber(subscriber: Omit<NewsletterSubscriber, 'id'>): Promise<string> {
    const newsletterSubscribersCol = collection(db, 'newsletter_subscribers').withConverter(newsletterSubscriberConverter);
    const docRef = await addDoc(newsletterSubscribersCol, subscriber);
    return docRef.id;
}
