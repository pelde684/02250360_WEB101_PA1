"use client";

import { useRef, useEffect, useState } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { likeVideo, unlikeVideo } from '../../services/videoService';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(video.isLiked || false);
  const [likeCount, setLikeCount] = useState(video._count?.likes || 0);

  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.7,
  });

  // Auto play/pause based on visibility
  useEffect(() => {
    if (!videoRef.current) return;
    if (isVisible) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isVisible]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikeVideo(video.id);
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await likeVideo(video.id);
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div ref={containerRef} className="relative flex gap-4 p-4 border-b border-gray-200">
      {/* User Avatar */}
      <div className="flex-shrink-0">
        <img
          src={video.user?.profilePicture || '/default-avatar.png'}
          alt={video.user?.username}
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>

      <div className="flex-1">
        {/* Username */}
        <p className="font-semibold text-sm mb-1">@{video.user?.username}</p>

        {/* Caption */}
        {video.caption && (
          <p className="text-sm text-gray-700 mb-2">{video.caption}</p>
        )}

        {/* Video Player */}
        <div className="relative rounded-xl overflow-hidden bg-black" style={{ maxWidth: 400 }}>
          {video.videoUrl ? (
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full"
              style={{ maxHeight: '500px' }}
              loop
              muted
              playsInline
              onClick={togglePlay}
              onError={(e) => console.error('Video error:', e, video.videoUrl)}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-white">
              <p>Video unavailable</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-2">
          <button onClick={handleLike} className="flex items-center gap-1 text-sm">
            <Heart
              size={20}
              className={liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}
            />
            <span>{likeCount}</span>
          </button>

          <button className="flex items-center gap-1 text-sm text-gray-500">
            <MessageCircle size={20} />
            <span>{video._count?.comments || 0}</span>
          </button>

          <button className="flex items-center gap-1 text-sm text-gray-500">
            <Share2 size={20} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;