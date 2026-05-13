const prisma = require('../lib/prisma');

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    console.log('getAllVideos called');
    
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, username: true, name: true, avatar: true }
        }
      }
    });
    
    console.log(`Found ${videos.length} videos`);
    
    res.status(200).json({
      videos: videos,
      pagination: {
        nextCursor: null,
        hasNextPage: false
      }
    });
  } catch (error) {
    console.error('Error in getAllVideos:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
};

// Get user's videos
exports.getUserVideos = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`getUserVideos called for user ${id}`);
    
    const videos = await prisma.video.findMany({
      where: { userId: parseInt(id) },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, username: true, name: true, avatar: true }
        }
      }
    });
    
    res.status(200).json({
      videos: videos,
      pagination: {
        nextCursor: null,
        hasNextPage: false
      }
    });
  } catch (error) {
    console.error('Error in getUserVideos:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
};

// Get video by ID
exports.getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await prisma.video.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: { id: true, username: true, name: true, avatar: true }
        }
      }
    });
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get video comments
exports.getVideoComments = async (req, res) => {
  try {
    res.status(200).json({ comments: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Placeholder functions
exports.getFollowingVideos = async (req, res) => {
  res.status(200).json({ videos: [], pagination: { nextCursor: null, hasNextPage: false } });
};

exports.createVideo = async (req, res) => {
  res.status(200).json({ message: 'Upload functionality coming soon' });
};

exports.updateVideo = async (req, res) => {
  res.status(200).json({ message: 'Update functionality coming soon' });
};

exports.deleteVideo = async (req, res) => {
  res.status(200).json({ message: 'Delete functionality coming soon' });
};

exports.toggleVideoLike = async (req, res) => {
  res.status(200).json({ message: 'Like functionality coming soon' });
};