/**
 * AuthContext - App-wide authentication state
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, signIn, signUp, signOut, getCurrentUser, onAuthStateChange, SignUpData, SignInData } from '../services/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  setDevUser: () => void;
}

// Dev mode user for testing without real auth
const DEV_USER: AuthUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'dev@rizzk.test',
  fullName: 'Dev Tester',
  age: 25,
  gender: 'male',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      await signUp(data);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (data: SignInData) => {
    setLoading(true);
    try {
      await signIn(data);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Dev mode: set a fake user for testing
  const setDevUser = () => {
    setUser(DEV_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        setDevUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

