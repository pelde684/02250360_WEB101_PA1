// src/services/uploadService.js
import supabase from '../lib/supabase';
import apiClient from '../lib/api-config';

const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomStr}.${extension}`;
};

export const uploadVideoToStorage = async (userId, file) => {
  try {
    console.log('Uploading video to Supabase...', { userId, fileName: file.name, size: file.size });
    
    const fileName = generateUniqueFileName(file.name);
    const filePath = `user-${userId}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    console.log('Video uploaded successfully:', data);
    
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
    
    return { 
      url: urlData.publicUrl,
      storagePath: filePath
    };
  } catch (error) {
    console.error('Error in uploadVideoToStorage:', error);
    throw error;
  }
};

export const uploadThumbnailToStorage = async (userId, file) => {
  try {
    console.log('Uploading thumbnail to Supabase...');
    
    const fileName = generateUniqueFileName(file.name);
    const filePath = `user-${userId}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('thumbnails')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(filePath);
    
    return { 
      url: urlData.publicUrl,
      storagePath: filePath
    };
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    throw error;
  }
};

export const createVideo = async (videoData) => {
  try {
    console.log('Saving video metadata to backend...', videoData);
    
    const response = await apiClient.post('/api/videos', {
      videoUrl: videoData.videoUrl,
      videoPath: videoData.videoStoragePath,
      thumbnailUrl: videoData.thumbnailUrl || null,
      thumbnailPath: videoData.thumbnailStoragePath || null,
      caption: videoData.caption
    });
    
    console.log('Video metadata saved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating video:', error);
    console.error('Error response:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to save video');
  }
};