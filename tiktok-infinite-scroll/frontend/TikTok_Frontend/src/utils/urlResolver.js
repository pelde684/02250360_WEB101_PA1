// src/utils/urlResolver.js

const SUPABASE_URL = 'https://wnmakeopgjsesdwppby.supabase.co';
const BACKEND_URL = 'http://localhost:5001';

export const resolveVideoUrl = (url) => {
  if (!url) return null;
  
  // If it's already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a Supabase storage path
  if (url.includes('/storage/v1/object/')) {
    return url;
  }
  
  // For Supabase video bucket paths
  if (url.includes('/videos/')) {
    return `${SUPABASE_URL}/storage/v1/object/public/videos/${url}`;
  }
  
  // For local backend paths
  if (url.startsWith('/')) {
    return `${BACKEND_URL}${url}`;
  }
  
  return `${BACKEND_URL}/${url}`;
};

export const resolveAvatarUrl = (url) => {
  if (!url) return null;
  
  // If it's already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a Supabase storage path
  if (url.includes('/storage/v1/object/')) {
    return url;
  }
  
  // For Supabase avatars bucket paths
  if (url.includes('/avatars/')) {
    return `${SUPABASE_URL}/storage/v1/object/public/avatars/${url}`;
  }
  
  // For local backend paths
  if (url.startsWith('/')) {
    return `${BACKEND_URL}${url}`;
  }
  
  return `${BACKEND_URL}/${url}`;
};