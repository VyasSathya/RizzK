/**
 * Photos Service
 * Handles photo uploads to Supabase Storage
 */

import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export interface UserPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

/**
 * Upload a photo to Supabase Storage
 */
export async function uploadPhoto(uri: string, isPrimary: boolean = false): Promise<UserPhoto> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  // Read file as base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Generate unique filename
  const ext = uri.split('.').pop() || 'jpg';
  const fileName = `${user.id}/${Date.now()}.${ext}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(fileName, decode(base64), {
      contentType: `image/${ext}`,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);

  // Save to user_photos table
  const { data, error } = await supabase
    .from('user_photos')
    .insert({
      user_id: user.id,
      photo_url: publicUrl,
      is_primary: isPrimary,
      sort_order: Date.now(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user's photos
 */
export async function getUserPhotos(): Promise<UserPhoto[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_photos')
    .select('*')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Delete a photo
 */
export async function deletePhoto(photoId: string): Promise<void> {
  const { error } = await supabase
    .from('user_photos')
    .delete()
    .eq('id', photoId);

  if (error) throw error;
}

/**
 * Set primary photo
 */
export async function setPrimaryPhoto(photoId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  // Clear all primary flags
  await supabase
    .from('user_photos')
    .update({ is_primary: false })
    .eq('user_id', user.id);

  // Set new primary
  const { error } = await supabase
    .from('user_photos')
    .update({ is_primary: true })
    .eq('id', photoId);

  if (error) throw error;
}

