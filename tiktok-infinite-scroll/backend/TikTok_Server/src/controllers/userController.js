const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Register user
const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    
    console.log("Registration attempt:", { username, email });
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email or username" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName: fullName || username,
      }
    });
    
    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'your_secret_key_here',
      { expiresIn: '7d' }
    );
    
    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({ 
      success: true,
      message: "User created successfully",
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Registration error details:", error);
    res.status(500).json({ error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'your_secret_key_here',
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      success: true,
      token, 
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    
    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUserId }
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true
          }
        }
      }
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            videos: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get user's followers
const getUserFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    
    const followers = await prisma.follow.findMany({
      where: { followingId: id },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          }
        }
      }
    });
    
    res.json(followers.map(f => f.follower));
  } catch (error) {
    console.error('Error getting followers:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get users that a user is following
const getUserFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    
    const following = await prisma.follow.findMany({
      where: { followerId: id },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          }
        }
      }
    });
    
    res.json(following.map(f => f.following));
  } catch (error) {
    console.error('Error getting following:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            videos: true
          }
        }
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Follow a user
const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;
    
    if (!currentUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (id === currentUserId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    const userToFollow = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const follow = await prisma.follow.create({
      data: {
        followerId: currentUserId,
        followingId: id
      }
    });
    
    res.status(201).json({ message: 'Following user successfully', follow });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Already following this user' });
    }
    console.error('Error following user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;
    
    if (!currentUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: id
        }
      }
    });
    
    res.json({ message: 'Unfollowed user successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { fullName, avatar, username } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName || undefined,
        avatar: avatar || undefined,
        username: username || undefined
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        avatar: true
      }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
};

// Export all functions
module.exports = { 
  register, 
  login, 
  getAllUsers, 
  getUserById, 
  getUserFollowers,
  getUserFollowing,
  getCurrentUser,
  followUser, 
  unfollowUser, 
  updateProfile 
};