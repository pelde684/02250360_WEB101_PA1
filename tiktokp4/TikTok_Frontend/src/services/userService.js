import apiClient from '../lib/axios';

export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Update current user profile (using profile/me endpoint)
export const updateUser = async (userData) => {
  try {
    const response = await apiClient.put(`/users/profile/me`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update user with avatar image upload
export const updateUserWithAvatar = async (formData) => {
  try {
    const response = await apiClient.put(`/users/profile/me`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user with avatar:', error);
    throw error;
  }
};

// Get current user profile
export const getCurrentUserProfile = async () => {
  try {
    const response = await apiClient.get(`/users/profile/me`);
    return response.data;
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    throw error;
  }
};

export const followUser = async (userId) => {
  try {
    console.log(`Following user ${userId}`);
    const response = await apiClient.post(`/users/${userId}/follow`);
    return response.data;
  } catch (error) {
    console.error(`Error following user ${userId}:`, error);
    throw error;
  }
};

export const unfollowUser = async (userId) => {
  try {
    console.log(`Unfollowing user ${userId}`);
    const response = await apiClient.delete(`/users/${userId}/follow`);
    return response.data;
  } catch (error) {
    console.error(`Error unfollowing user ${userId}:`, error);
    throw error;
  }
};

export const getUserFollowers = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}/followers`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching followers for user ${id}:`, error);
    throw error;
  }
};

export const getUserFollowing = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}/following`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching following for user ${id}:`, error);
    throw error;
  }
};

// Fixed: Get user videos using the correct endpoint /videos/user/:userId
export const getUserVideos = async (userId) => {
  try {
    // Handle both object and direct id
    const id = typeof userId === 'object' ? userId.id : userId;
    
    // FIXED: Changed from /users/${id}/videos to /videos/user/${id}
    const response = await apiClient.get(`/videos/user/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching videos for user ${userId}:`, error);
    return { videos: [] };
  }
};