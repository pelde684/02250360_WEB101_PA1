// Mock Video Controller - No database needed for testing
// This will work while you fix your database connection

// Mock data store (in memory)
let mockVideos = [];

// Initialize with some sample videos
const initMockVideos = () => {
  if (mockVideos.length === 0) {
    mockVideos = [
      {
        id: '1',
        title: 'Sample Video 1',
        description: 'This is a sample video for testing',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/300x400',
        userId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: 'user1',
          username: 'demo_user',
          profilePicture: null
        },
        _count: {
          likes: 0,
          comments: 0
        }
      },
      {
        id: '2',
        title: 'Sample Video 2',
        description: 'Another test video',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/300x400',
        userId: 'user2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: 'user2',
          username: 'test_user',
          profilePicture: null
        },
        _count: {
          likes: 0,
          comments: 0
        }
      }
    ];
  }
};

// Get all videos with cursor-based pagination
exports.getAllVideos = async (req, res) => {
  try {
    initMockVideos();
    const { cursor, limit = 10 } = req.query;
    const take = parseInt(limit);
    
    console.log('Fetching videos (mock):', { cursor, limit });
    
    let videos = [...mockVideos];
    
    // Apply cursor pagination
    if (cursor) {
      const cursorIndex = videos.findIndex(v => v.id === cursor);
      if (cursorIndex !== -1) {
        videos = videos.slice(cursorIndex + 1);
      }
    }
    
    const hasNextPage = videos.length > take;
    const items = hasNextPage ? videos.slice(0, take) : videos;
    const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;
    
    res.json({
      videos: items,
      nextCursor,
      hasNextPage
    });
    
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get following videos
exports.getFollowingVideos = async (req, res) => {
  try {
    initMockVideos();
    const { cursor, limit = 10 } = req.query;
    const take = parseInt(limit);
    
    // For mock, return all videos (assuming you follow everyone)
    let videos = [...mockVideos];
    
    if (cursor) {
      const cursorIndex = videos.findIndex(v => v.id === cursor);
      if (cursorIndex !== -1) {
        videos = videos.slice(cursorIndex + 1);
      }
    }
    
    const hasNextPage = videos.length > take;
    const items = hasNextPage ? videos.slice(0, take) : videos;
    const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;
    
    res.json({
      videos: items,
      nextCursor,
      hasNextPage
    });
    
  } catch (error) {
    console.error('Error fetching following videos:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get single video
exports.getVideoById = async (req, res) => {
  try {
    initMockVideos();
    const { id } = req.params;
    
    const video = mockVideos.find(v => v.id === id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json(video);
    
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create video
exports.createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl } = req.body;
    const userId = req.user?.id || 'user1';
    
    const newVideo = {
      id: Date.now().toString(),
      title,
      description,
      videoUrl: videoUrl || 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      thumbnailUrl: thumbnailUrl || 'https://via.placeholder.com/300x400',
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: userId,
        username: 'current_user',
        profilePicture: null
      },
      _count: {
        likes: 0,
        comments: 0
      }
    };
    
    mockVideos.unshift(newVideo); // Add to beginning of array
    res.status(201).json(newVideo);
    
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ error: error.message });
  }
};

// Like video
exports.likeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user?.id || 'user1';
    
    const video = mockVideos.find(v => v.id === videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    video._count.likes += 1;
    
    res.status(201).json({ 
      message: 'Video liked', 
      like: { id: Date.now().toString(), userId, videoId }
    });
    
  } catch (error) {
    console.error('Error liking video:', error);
    res.status(500).json({ error: error.message });
  }
};

// Unlike video
exports.unlikeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user?.id || 'user1';
    
    const video = mockVideos.find(v => v.id === videoId);
    if (video && video._count.likes > 0) {
      video._count.likes -= 1;
    }
    
    res.json({ message: 'Video unliked' });
    
  } catch (error) {
    console.error('Error unliking video:', error);
    res.status(500).json({ error: error.message });
  }
};