'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { app, db, storage } from '@/lib/firebase';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { User } from '@/lib/types';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export type CustomUser = FirebaseUser & User;

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  userRole: string | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<UserCredential>;
  updateUser: (data: { [key: string]: any; }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser({ ...user, ...userData });
          setUserRole(userData.role);
        } else {
          // This case handles a user who is authenticated with Firebase,
          // but doesn't have a corresponding document in the 'users' collection.
          // This can happen with social sign-in or if a user document is manually deleted.
          const newUser: Partial<User> = {
            name: user.displayName || user.email || '',
            email: user.email || '',
            role: 'user',
            created_at: new Date(),
          };
          await setDoc(userDocRef, newUser);
          setUser({ ...user, ...newUser } as CustomUser);
          setUserRole('user');
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const newUser: Partial<User> = {
      name: displayName,
      email: email,
      role: 'user',
      created_at: new Date(),
    };
    await setDoc(userDocRef, newUser);
    setUser({ ...userCredential.user, ...newUser } as CustomUser);
    setUserRole('user');
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const googleSignIn = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const newUser: Partial<User> = {
        name: user.displayName || '',
        email: user.email || '',
        role: 'user',
        created_at: new Date(),
      };
      await setDoc(userDocRef, newUser);
      setUserRole('user');
    } else {
      setUserRole(userDoc.data().role);
    }
    return userCredential;
  };

  const updateUser = async (data: { [key: string]: any; }) => {
    if (!firebaseUser) return;
  
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      let downloadURL = firebaseUser.photoURL;
  
      if (data.avatar && typeof data.avatar !== 'string') {
        const storageRef = ref(storage, `avatars/${firebaseUser.uid}`);
        await uploadBytes(storageRef, data.avatar);
        downloadURL = await getDownloadURL(storageRef);
      }
      
      await updateProfile(firebaseUser, {
          displayName: data.name,
          photoURL: downloadURL,
      });
      
      await updateDoc(userDocRef, {
          ...data,
          avatar: downloadURL,
      });
  
      setUser({ ...user, ...data, displayName: data.name, photoURL: downloadURL } as CustomUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error; // Re-throw the error so the calling component knows about it.
    }
  };

  const value = {
    user,
    loading,
    userRole,
    login,
    signup,
    logout,
    googleSignIn,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
