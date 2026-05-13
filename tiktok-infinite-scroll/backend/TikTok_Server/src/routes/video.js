const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.get('/following/feed', authenticateToken, videoController.getFollowingVideos);
router.post('/', authenticateToken, videoController.createVideo);
router.post('/:videoId/like', authenticateToken, videoController.likeVideo);
router.delete('/:videoId/like', authenticateToken, videoController.unlikeVideo);

module.exports = router;