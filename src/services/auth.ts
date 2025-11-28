/**
 * RizzK Auth Service
 * Handles authentication with Supabase
 */

import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'other';
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  age?: number;
  gender?: string;
}

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpData) {
  const { email, password, fullName, age, gender } = data;

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Sign up failed');

  // Update profile with additional data
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      age,
      gender,
    })
    .eq('id', authData.user.id);

  if (profileError) {
    console.warn('Profile update failed:', profileError);
  }

  return authData.user;
}

/**
 * Sign in existing user
 */
export async function signIn(data: SignInData) {
  const { email, password } = data;

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return authData.user;
}

/**
 * Sign out current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current session
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Get current user with profile
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Fetch profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email || '',
    fullName: profile?.full_name,
    age: profile?.age,
    gender: profile?.gender,
  };
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
}

