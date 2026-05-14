// src/services/videoService.js
import apiClient from '../lib/api-config';

export const getVideos = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/api/videos?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

export const getFollowingVideos = async (limit = 10) => {
  try {
    const response = await apiClient.get(`/api/videos/following?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching following videos:', error);
    throw error;
  }
};

export const getVideoById = async (id) => {
  try {
    const response = await apiClient.get(`/api/videos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
};

// ADD THIS FUNCTION - Fix for profile page
export const getUserVideos = async (userId, page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/api/users/${userId}/videos?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user videos:', error);
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

export const getVideoComments = async (videoId) => {
  try {
    const response = await apiClient.get(`/api/videos/${videoId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const addComment = async (videoId, content) => {
  try {
    const response = await apiClient.post(`/api/videos/${videoId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};