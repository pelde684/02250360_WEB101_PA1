import apiClient from '../lib/axios';

// Uses cursor-based pagination
export const getVideos = async ({ cursor, limit = 10 }) => {
  try {
    let queryParams = `limit=${limit}`;
    if (cursor) {
      queryParams += `&cursor=${cursor}`;
    }
    
    const response = await apiClient.get(`/videos?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

// Uses cursor-based pagination for Following feed
export const getFollowingVideos = async ({ cursor, limit = 10 }) => {
  try {
    let queryParams = `limit=${limit}`;
    if (cursor) {
      queryParams += `&cursor=${cursor}`;
    }
    
    const response = await apiClient.get(`/videos/following?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching following videos:', error);
    throw error;
  }
};

export const getVideoById = async (id) => {
  try {
    const response = await apiClient.get(`/videos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching video ${id}:`, error);
    throw error;
  }
};

// Uses cursor-based pagination
export const getUserVideos = async ({ id, cursor, limit = 10 }) => {
  try {
    let queryParams = `limit=${limit}`;
    if (cursor) {
      queryParams += `&cursor=${cursor}`;
    }
    
    // FIXED: Changed from /users/${id}/videos to /videos/user/${id}
    const response = await apiClient.get(`/videos/user/${id}?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching videos for user ${id}:`, error);
    throw error;
  }
};

export const getVideoComments = async (videoId) => {
  try {
    const response = await apiClient.get(`/videos/${videoId}/comments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for video ${videoId}:`, error);
    return { comments: [] };
  }
};

export const likeVideo = async (videoId) => {
  try {
    const response = await apiClient.post(`/videos/${videoId}/like`);
    return response.data;
  } catch (error) {
    console.error(`Error liking video ${videoId}:`, error);
    throw error;
  }
};

export const unlikeVideo = async (videoId) => {
  try {
    // FIXED: Changed from DELETE to POST (same endpoint, server handles both)
    const response = await apiClient.post(`/videos/${videoId}/like`);
    return response.data;
  } catch (error) {
    console.error(`Error unliking video ${videoId}:`, error);
    throw error;
  }
};

// FIXED: Corrected the URL - should be /videos/:videoId/comments
export const addComment = async (videoId, content) => {
  try {
    const response = await apiClient.post(`/videos/${videoId}/comments`, {
      content
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to video ${videoId}:`, error);
    throw error;
  }
};

// Optional: Delete comment if needed
export const deleteComment = async (commentId) => {
  try {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    throw error;
  }
};