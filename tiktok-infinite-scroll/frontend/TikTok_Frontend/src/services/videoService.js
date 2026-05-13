import apiClient from '../lib/api-config';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper to fix video URL
export const getFullVideoUrl = (videoUrl) => {
  if (!videoUrl) return null;
  if (videoUrl.startsWith('http')) return videoUrl;
  return `${BASE_URL}/${videoUrl.replace(/^\//, '')}`;
};

export const getVideos = async ({ cursor = null, limit = 10 }) => {
  try {
    const params = { limit };
    if (cursor) params.cursor = cursor;

    const response = await apiClient.get('/api/videos', { params });

    const videos = (response.data.videos || []).map((video) => ({
      ...video,
      videoUrl: getFullVideoUrl(video.videoUrl),
    }));

    return {
      videos,
      nextCursor: response.data.nextCursor || null,
      hasNextPage: response.data.hasNextPage || false,
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

export const getFollowingVideos = async ({ cursor = null, limit = 10 }) => {
  try {
    const params = { limit };
    if (cursor) params.cursor = cursor;

    const response = await apiClient.get('/api/videos/following', { params });

    const videos = (response.data.videos || []).map((video) => ({
      ...video,
      videoUrl: getFullVideoUrl(video.videoUrl),
    }));

    return {
      videos,
      nextCursor: response.data.nextCursor || null,
      hasNextPage: response.data.hasNextPage || false,
    };
  } catch (error) {
    console.error('Error fetching following videos:', error);
    throw error;
  }
};

export const getUserVideos = async (userId) => {
  try {
    const response = await apiClient.get(`/api/users/${userId}/videos`);
    const videos = (response.data || []).map((video) => ({
      ...video,
      videoUrl: getFullVideoUrl(video.videoUrl),
    }));
    return videos;
  } catch (error) {
    console.error('Error fetching user videos:', error);
    throw error;
  }
};

export const getVideoById = async (id) => {
  try {
    const response = await apiClient.get(`/api/videos/${id}`);
    return {
      ...response.data,
      videoUrl: getFullVideoUrl(response.data.videoUrl),
    };
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
};

export const createVideo = async (videoData) => {
  try {
    const response = await apiClient.post('/api/videos', videoData);
    return response.data;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

export const likeVideo = async (videoId) => {
  try {
    const response = await apiClient.post(`/api/videos/${videoId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking video:', error);
    throw error;
  }
};

export const unlikeVideo = async (videoId) => {
  try {
    const response = await apiClient.delete(`/api/videos/${videoId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error unliking video:', error);
    throw error;
  }
};