const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getAllUsers, 
  getUserById, 
  getCurrentUser,
  followUser, 
  unfollowUser,
  updateProfile 
} = require('../controllers/userController');

// Auth routes
router.post('/register', register);
router.post('/login', login);

// User routes
router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:id', getUserById);
router.put('/profile', updateProfile);

// Follow/Unfollow routes
router.post('/:id/follow', followUser);
router.delete('/:id/follow', unfollowUser);

module.exports = router;