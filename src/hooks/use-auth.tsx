// This file implements the authentication context and provider for the entire application.
// It uses the real Firebase SDK to handle signup, login, logout, and session persistence.
// It also fetches user roles from Firestore to enable role-based access control.

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from './use-toast';

// Define the shape of the user role, which matches the roles in our system.
type UserRole = 'user' | 'editor' | 'admin';

// Define the shape of the authentication context.
interface AuthContextType {
  user: FirebaseUser | null; // The Firebase user object.
  loading: boolean;
  userRole: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // This effect hook listens for changes in the user's authentication state.
  // It's the core of session management in a Firebase app.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If a user is logged in, we fetch their custom data (like their role) from our Firestore 'users' collection.
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role as UserRole);
        } else {
            // This case handles users who signed up but don't have a user document yet (e.g., Google sign-in first time).
            // We can create a default user document for them here.
            await setDoc(userDocRef, {
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                role: 'user',
                createdAt: serverTimestamp(),
            });
            setUserRole('user');
        }
        setUser(firebaseUser);

      } else {
        // If no user is logged in, clear all user-related state.
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount to prevent memory leaks.
    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // After creating the user, update their profile with their name.
    await updateProfile(userCredential.user, { displayName: name });
  
    // Create a corresponding user document in Firestore to store their role and other app-specific data.
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDocRef, {
      name,
      email,
      role: 'user', // All new signups get the 'user' role by default.
      createdAt: serverTimestamp(),
    });
    // The `onAuthStateChanged` listener will automatically handle setting the user state and role.
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // `onAuthStateChanged` handles the rest.
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
     // `onAuthStateChanged` handles the rest, including creating a new user doc if it's the first time.
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login'); // Redirect to login page after logout.
  };

  const value = {
    user,
    loading,
    userRole,
    login,
    signup,
    logout,
    loginWithGoogle,
  };

  // Render children only after the initial loading is complete to avoid UI flickering.
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
