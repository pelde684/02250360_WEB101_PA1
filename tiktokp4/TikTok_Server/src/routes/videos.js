const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only video files are allowed for video field'));
      }
    } else if (file.fieldname === 'thumbnail') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for thumbnail field'));
      }
    } else {
      cb(null, true);
    }
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ========== SPECIFIC ROUTES FIRST (ORDER MATTERS!) ==========

// Get following videos feed
router.get('/following', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });
    
    const followingIds = following.map(f => f.followingId);
    
    if (followingIds.length === 0) {
      return res.json({ videos: [], pagination: { nextCursor: null, hasNextPage: false } });
    }
    
    const videos = await prisma.video.findMany({
      where: { userId: { in: followingIds } },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { likes: true, comments: true } }
      }
    });
    
    const formattedVideos = videos.map(video => ({
      ...video,
      likeCount: video._count.likes,
      commentCount: video._count.comments,
      videoUrl: `http://localhost:8000${video.videoUrl}`,
      thumbnailUrl: video.thumbnailUrl ? `http://localhost:8000${video.thumbnailUrl}` : null,
      _count: undefined
    }));
    
    res.json({ videos: formattedVideos, pagination: { nextCursor: null, hasNextPage: false } });
  } catch (error) {
    console.error('Error fetching following videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's videos
router.get('/user/:userId', async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      where: { userId: parseInt(req.params.userId) },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { likes: true, comments: true } }
      }
    });
    
    const formattedVideos = videos.map(video => ({
      ...video,
      likeCount: video._count.likes,
      commentCount: video._count.comments,
      videoUrl: `http://localhost:8000${video.videoUrl}`,
      thumbnailUrl: video.thumbnailUrl ? `http://localhost:8000${video.thumbnailUrl}` : null,
      _count: undefined
    }));
    
    res.json({ videos: formattedVideos, pagination: { nextCursor: null, hasNextPage: false } });
  } catch (error) {
    console.error('Error fetching user videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== FIXED COMMENT ROUTES ==========

// Get comments for a video - RETURNS ARRAY DIRECTLY
router.get('/:id/comments', async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }
    
    const comments = await prisma.comment.findMany({
      where: { videoId: videoId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { 
          select: { 
            id: true, 
            username: true, 
            name: true, 
            avatar: true 
          } 
        }
      }
    });
    
    console.log(`Found ${comments.length} comments for video ${videoId}`);
    res.status(200).json(comments);
  } catch (error) {
    console.error('Fetch comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Add comment to video - RETURNS COMMENT OBJECT DIRECTLY
router.post('/:id/comments', verifyToken, async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }
    
    const userId = req.user.id;
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }
    
    // Check if video exists
    const video = await prisma.video.findUnique({ 
      where: { id: videoId } 
    });
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Create comment
    const comment = await prisma.comment.create({
      data: { 
        content: content.trim(), 
        userId: userId, 
        videoId: videoId 
      },
      include: { 
        user: { 
          select: { 
            id: true, 
            username: true, 
            name: true, 
            avatar: true 
          } 
        } 
      }
    });
    
    console.log(`Comment added to video ${videoId} by user ${userId}`);
    res.status(201).json(comment);
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Like/Unlike a video
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    if (isNaN(videoId)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }
    
    const userId = req.user.id;
    
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    const existingLike = await prisma.videoLike.findUnique({
      where: { userId_videoId: { userId: userId, videoId: videoId } }
    });
    
    if (existingLike) {
      await prisma.videoLike.delete({
        where: { userId_videoId: { userId: userId, videoId: videoId } }
      });
      const likeCount = await prisma.videoLike.count({ where: { videoId: videoId } });
      return res.json({ message: 'Unliked', liked: false, likeCount });
    } else {
      await prisma.videoLike.create({ data: { userId: userId, videoId: videoId } });
      const likeCount = await prisma.videoLike.count({ where: { videoId: videoId } });
      return res.json({ message: 'Liked', liked: true, likeCount });
    }
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Failed to process like' });
  }
});

// Upload video endpoint - FIXED to handle JSON parsing
router.post('/upload', verifyToken, (req, res, next) => {
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('Processing upload...');
    console.log('Files received:', req.files ? Object.keys(req.files) : 'none');
    
    const videoFile = req.files?.video?.[0];
    if (!videoFile) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }
    
    const thumbnailFile = req.files?.thumbnail?.[0];
    
    // Handle caption safely - it could be string or undefined
    let caption = '';
    if (req.body.caption) {
      caption = typeof req.body.caption === 'string' ? req.body.caption : JSON.stringify(req.body.caption);
    }
    
    const fullVideoUrl = `http://localhost:8000/uploads/${videoFile.filename}`;
    const fullThumbnailUrl = thumbnailFile ? `http://localhost:8000/uploads/${thumbnailFile.filename}` : null;
    
    const video = await prisma.video.create({
      data: {
        userId: req.user.id,
        caption: caption,
        videoUrl: fullVideoUrl,
        thumbnailUrl: fullThumbnailUrl,
        videoStoragePath: videoFile.path
      },
      include: {
        user: { 
          select: { 
            id: true, 
            username: true, 
            name: true, 
            avatar: true 
          } 
        }
      }
    });
    
    console.log(`Video uploaded successfully: ${video.id}`);
    res.status(201).json(video);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed: ' + error.message });
  }
});

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { likes: true, comments: true } }
      }
    });
    
    const formattedVideos = videos.map(video => ({
      ...video,
      likeCount: video._count.likes,
      commentCount: video._count.comments,
      videoUrl: video.videoUrl || `http://localhost:8000${video.videoUrl}`,
      thumbnailUrl: video.thumbnailUrl ? (video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `http://localhost:8000${video.thumbnailUrl}`) : null,
      _count: undefined
    }));
    
    res.json({ videos: formattedVideos, pagination: { nextCursor: null, hasNextPage: false } });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== GENERIC :id ROUTE LAST! ==========
// Get video by ID (MUST BE LAST!)
router.get('/:id', async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    if (isNaN(videoId)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }
    
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { likes: true, comments: true } }
      }
    });
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    const formattedVideo = {
      ...video,
      likeCount: video._count.likes,
      commentCount: video._count.comments,
      videoUrl: video.videoUrl || `http://localhost:8000${video.videoUrl}`,
      thumbnailUrl: video.thumbnailUrl ? (video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `http://localhost:8000${video.thumbnailUrl}`) : null,
      _count: undefined
    };
    
    res.json(formattedVideo);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;