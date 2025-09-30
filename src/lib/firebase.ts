// This file is responsible for initializing the Firebase app and exporting the various Firebase services.
// It uses environment variables to configure the connection, ensuring that sensitive keys are not hardcoded.

// Import the necessary functions from the Firebase SDK.
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// The configuration object for Firebase.
// These values are pulled from environment variables, which should be stored in a `.env.local` file in the root of your project.
// Example .env.local:
// NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
// NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
// NEXT_PUBLIC_FIREBASE_APP_ID="..."
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase.
// The `getApps().length` check prevents the app from being initialized more than once,
// which is a common issue in Next.js with its hot-reloading feature.
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Get instances of the Firebase services we'll be using.
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// Export the initialized app and service instances so they can be used throughout the application.
export { app, auth, db, storage };
