import { createContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName });
    await setDoc(doc(db, 'profiles', newUser.uid), {
      uid: newUser.uid,
      email: newUser.email,
      displayName,
      createdAt: serverTimestamp(),
      stats: {
        completed: 0,
        upcoming: 0,
        ongoing: 0
      }
    });
  }, []);

  const logout = useCallback(() => signOut(auth), []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export async function fetchUserProfile(uid: string) {
  const profileDoc = await getDoc(doc(db, 'profiles', uid));
  return profileDoc.exists() ? profileDoc.data() : null;
}
