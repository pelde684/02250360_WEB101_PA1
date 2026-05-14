'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { likeVideo, unlikeVideo } from '../../services/videoService';
import { resolveVideoUrl, resolveAvatarUrl } from '../../utils/urlResolver';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(video.isLiked || false);
  const [likeCount, setLikeCount] = useState(video._count?.likes || 0);
  const [avatarError, setAvatarError] = useState(false);

  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.7,
  });

  const avatarUrl = resolveAvatarUrl(video.user?.profilePicture || video.user?.avatar);
  const videoUrl = resolveVideoUrl(video.videoUrl);

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
      {/* User Avatar with Profile Link */}
      <div className="flex-shrink-0">
        <Link href={`/profile/${video.user?.id}`}>
          {avatarUrl && !avatarError ? (
            <img
              src={avatarUrl}
              alt={video.user?.username}
              className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer">
              <span className="text-white font-semibold text-lg">
                {video.user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1">
        {/* Username with Profile Link */}
        <Link href={`/profile/${video.user?.id}`}>
          <p className="font-semibold text-sm mb-1 hover:underline cursor-pointer">
            @{video.user?.username}
          </p>
        </Link>

        {/* Caption */}
        {video.caption && (
          <p className="text-sm text-gray-700 mb-2">{video.caption}</p>
        )}

        {/* Video Player */}
        <div className="relative rounded-xl overflow-hidden bg-black" style={{ maxWidth: 400 }}>
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full"
              style={{ maxHeight: '500px' }}
              loop
              muted
              playsInline
              onClick={togglePlay}
              onError={(e) => {
                console.error('Video error:', videoUrl);
                e.target.style.display = 'none';
                // Show error message
                const parent = e.target.parentElement;
                if (parent) {
                  const errorDiv = document.createElement('div');
                  errorDiv.className = 'flex items-center justify-center h-64 text-white';
                  errorDiv.innerHTML = '<p>🎬 Video unavailable</p>';
                  parent.appendChild(errorDiv);
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-white">
              <p>🎬 Video unavailable</p>
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

          <Link href={`/video/${video.id}`}>
            <button className="flex items-center gap-1 text-sm text-gray-500">
              <MessageCircle size={20} />
              <span>{video._count?.comments || 0}</span>
            </button>
          </Link>

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