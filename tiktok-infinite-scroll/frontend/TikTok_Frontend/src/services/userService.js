import apiClient from '../lib/api-config';

// Get all users (for explore page)
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/api/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Get user's followers
export const getUserFollowers = async (userId) => {
  try {
    const response = await apiClient.get(`/api/users/${userId}/followers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
};

// Get users that a user is following
export const getUserFollowing = async (userId) => {
  try {
    const response = await apiClient.get(`/api/users/${userId}/following`);
    return response.data;
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error;
  }
};

// Follow a user
export const followUser = async (userId) => {
  try {
    const response = await apiClient.post(`/api/users/${userId}/follow`);
    return response.data;
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

// Unfollow a user
export const unfollowUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/api/users/${userId}/follow`);
    return response.data;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};

// Get current user's profile
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Update user profile
export const updateUser = async (userData) => {
  try {
    const response = await apiClient.put('/api/users/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};