# Firebase Integration Guide for Travonex

This document provides a comprehensive, step-by-step guide to migrating the Travonex application from its current mock data system to a full-fledged Firebase backend. This will enable real user authentication, persistent data storage, and scalable image uploads.

## Table of Contents

1.  **Firebase Project Setup**
2.  **Enabling Authentication**
3.  **Firestore Database Setup**
    *   Data Modeling
    *   Firestore Security Rules
4.  **Firebase Storage for Images**
    *   Storage Security Rules
5.  **Code Migration Plan**
    *   Step 1: Connecting Firebase to the App
    *   Step 2: Migrating the Authentication Hook (`useAuth`)
    *   Step 3: Replacing Mock Data with Firestore Queries
    *   Step 4: Handling Image Uploads
    *   Step 5: Securing Admin Routes
6.  **Deployment**

---

### 1. Firebase Project Setup

First, you need a Firebase project to connect your application to.

1.  **Go to the Firebase Console:** Visit [https://console.firebase.google.com/](https://console.firebase.google.com/).
2.  **Create a Project:** Click "Add project", give it a name (e.g., "Travonex"), and follow the on-screen instructions. It's recommended to enable Google Analytics.
3.  **Register Your Web App:**
    *   In your project's dashboard, click the web icon (`</>`) to add a new web app.
    *   Give it a nickname (e.g., "Travonex Web").
    *   Firebase will provide a configuration object (`firebaseConfig`). **Copy this object.**

---

### 2. Enabling Authentication

We need to enable the sign-in methods we want to support.

1.  In the Firebase Console, go to **Build > Authentication**.
2.  Click the **"Get started"** button.
3.  On the **Sign-in method** tab, enable the following providers:
    *   **Email/Password:** Simply toggle the switch to "Enabled".
    *   **Google:** Toggle to "Enabled", provide a project support email, and save.

---

### 3. Firestore Database Setup

Firestore will be our NoSQL database for storing all user-generated content and user roles.

1.  In the Firebase Console, go to **Build > Firestore Database**.
2.  Click **"Create database"**.
3.  Start in **Production mode**. This ensures your data is secure by default.
4.  Choose a location for your database servers (choose one close to your primary user base).

#### Data Modeling

We will use the following collections to store our data:

*   **`users`**: Stores additional information about users, including their role.
    *   *Document ID*: User's `uid` from Firebase Authentication.
    *   *Fields*: `name`, `email`, `role` (`'admin'`, `'editor'`, or `'user'`), `createdAt`.
*   **`posts`**: Stores all blog articles.
    *   *Document ID*: Auto-generated.
    *   *Fields*: `title`, `slug`, `content`, `excerpt`, `authorId` (the author's `uid`), `status` (`'draft'`, `'pending'`, `'published'`), `featuredImgUrl`, `createdAt`, `updatedAt`.
*   **`comments`**: Stores all comments on posts.
    *   *Document ID*: Auto-generated.
    *   *Fields*: `postId`, `userId`, `commentText`, `imageUrl` (optional), `status` (`'pending'`, `'approved'`), `createdAt`.
*   **`stories`**: Stores all follow-up stories.
    *   *Document ID*: Auto-generated.
    *   *Fields*: `postId`, `userId`, `storyText`, `imageUrl` (optional), `status` (`'pending'`, `'approved'`), `createdAt`.

#### Firestore Security Rules

Security rules are crucial for protecting your data. Go to the **Rules** tab in the Firestore console and replace the default rules with the following. These rules enforce our role-based access control.

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if a user is an admin or editor
    function isModerator() {
      return getUserRole(request.auth.uid) in ['admin', 'editor'];
    }

    // Helper function to get a user's role from the 'users' collection
    function getUserRole(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data.role;
    }

    // USERS collection:
    // - Authenticated users can read their own data.
    // - Users can create their own user document on signup.
    // - Admins can read/write any user document (for managing roles).
    match /users/{userId} {
      allow read, update: if request.auth.uid == userId || getUserRole(request.auth.uid) == 'admin';
      allow create: if request.auth.uid == userId;
    }

    // POSTS collection:
    // - Anyone can read published posts.
    // - Authenticated users can create new posts (they will be 'pending').
    // - Moderators can read/write all posts (for approval/editing).
    match /posts/{postId} {
      allow read: if resource.data.status == 'published' || isModerator();
      allow create: if request.auth != null;
      allow update, delete: if isModerator();
    }

    // COMMENTS and STORIES collections:
    // - Anyone can read approved comments/stories.
    // - Authenticated users can create new ones (status will be 'pending').
    // - Moderators can update/delete any comment/story.
    match /{collection}/{docId} where collection in ['comments', 'stories'] {
       allow read: if resource.data.status == 'approved' || isModerator();
       allow create: if request.auth != null;
       allow update, delete: if isModerator();
    }
  }
}
```

---

### 4. Firebase Storage for Images

Storage is where we will upload and host images for posts, comments, and stories.

1.  In the Firebase Console, go to **Build > Storage**.
2.  Click **"Get started"** and follow the prompts.

#### Storage Security Rules

Go to the **Rules** tab in the Storage console and update the rules to allow authenticated users to upload images to a specific path.

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to write to an 'uploads' folder.
    // We can add more specific rules later (e.g., file size, type).
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

### 5. Code Migration Plan

Now, we'll replace the mock system with live Firebase calls.

#### Step 1: Connecting Firebase to the App

1.  **Create a `.env.local` file** in the root of your project. This file is for secret keys and is ignored by Git. Add the Firebase config you copied earlier.

    ```bash
    # .env.local

    NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
    NEXT_PUBLIC_FIREBASE_APP_ID="..."
    ```

2.  **Update the Firebase Initialization File** (`src/lib/firebase.ts`). Replace the blank file with the actual Firebase setup.

    ```typescript
    // src/lib/firebase.ts

    import { initializeApp, getApps } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";
    import { getStorage } from "firebase/storage";

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Initialize Firebase
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

    export { app, auth, db, storage };
    ```

#### Step 2: Migrating the Authentication Hook (`useAuth`)

Update `src/hooks/use-auth.tsx` to use Firebase Auth instead of `localStorage` and mock data.

```typescript
// src/hooks/use-auth.tsx (snippet)

import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// ... inside the AuthProvider component

const [user, setUser] = useState<FirebaseUser | null>(null);
const [userRole, setUserRole] = useState<string | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  // Listen for authentication state changes
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in. Fetch their role from Firestore.
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role);
      }
      setUser(user);
    } else {
      // User is signed out.
      setUser(null);
      setUserRole(null);
    }
    setLoading(false);
  });

  return () => unsubscribe(); // Cleanup subscription on unmount
}, []);

const signup = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });

  // Create a user document in Firestore to store their role
  const userDocRef = doc(db, 'users', userCredential.user.uid);
  await setDoc(userDocRef, {
    name,
    email,
    role: 'user', // Default role
    createdAt: new Date(),
  });
  // The onAuthStateChanged listener will handle the rest.
};

const login = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

const logout = async () => {
  await signOut(auth);
  router.push('/login');
};

// ... implement loginWithGoogle similarly using signInWithPopup
```

#### Step 3: Replacing Mock Data with Firestore Queries

Now, replace calls to `mock-data.ts` with Firestore queries. For example, fetching published posts for the blog index page.

```typescript
// src/app/blog/page.tsx (example of fetching posts)

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

async function getPublishedPosts() {
  const postsRef = collection(db, 'posts');
  const q = query(
    postsRef,
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return posts;
}

// In your component:
const posts = await getPublishedPosts();
```

You would apply this pattern to all pages that currently use mock data (admin pages, user dashboard, etc.), creating queries that match the required data.

#### Step 4: Handling Image Uploads

When a user submits a comment with an image, you'll upload the file to Firebase Storage and then save the download URL to Firestore.

```typescript
// src/components/blog/interactive-section.tsx (example upload logic)

import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const handleSubmit = async (e) => {
  e.preventDefault();
  let imageUrl = '';

  if (imageFile) {
    // 1. Create a storage reference
    const storageRef = ref(storage, `uploads/${user.uid}/${Date.now()}_${imageFile.name}`);

    // 2. Upload the file
    const snapshot = await uploadBytes(storageRef, imageFile);

    // 3. Get the public download URL
    imageUrl = await getDownloadURL(snapshot.ref);
  }

  // 4. Save the comment data (including the URL) to Firestore
  await addDoc(collection(db, 'comments'), {
    postId: articleId,
    userId: user.uid,
    comment_text: content,
    image_url: imageUrl,
    status: 'pending',
    created_at: new Date(),
  });

  // ... rest of the logic (toast, clear form, etc.)
};
```

#### Step 5: Securing Admin Routes

The `useAuth` hook now provides the `userRole`. You can use this to protect the admin layout.

```typescript
// src/app/blog/admin/layout.tsx

const { user, loading, userRole } = useAuth();
const router = useRouter();

useEffect(() => {
  if (!loading) {
    if (!user || !['admin', 'editor'].includes(userRole)) {
      router.push('/login'); // or an 'access-denied' page
    }
  }
}, [user, loading, userRole, router]);

if (loading || !user || !['admin', 'editor'].includes(userRole)) {
  // Show a loading screen or a proper access denied message
  return <div>Loading or Access Denied...</div>;
}

return <>{children}</>;
```

---

### 6. Deployment

You have two excellent options for deploying your Next.js application.

*   **Vercel (Recommended for Next.js):** Vercel is the creator of Next.js and offers a seamless, Git-based deployment experience. It's optimized for Next.js features like Server Components and Server Actions.
    1.  Push your code to a GitHub/GitLab/Bitbucket repository.
    2.  Sign up for Vercel and import your Git repository.
    3.  Add your `.env.local` variables as Environment Variables in the Vercel project settings.
    4.  Vercel will automatically build and deploy your site on every push.

*   **Firebase Hosting:** If you want to keep your entire stack within the Firebase ecosystem, Firebase Hosting is a great choice.
    1.  Install the Firebase CLI: `npm install -g firebase-tools`
    2.  Login: `firebase login`
    3.  Initialize hosting: `firebase init hosting`
    4.  Deploy: `firebase deploy`

This guide provides a solid roadmap for elevating your project from a mock prototype to a fully functional, scalable web application with Firebase.

