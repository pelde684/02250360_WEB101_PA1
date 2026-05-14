"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaComment, FaShare, FaMusic, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useAuth } from "../../contexts/authContext";
import { likeVideo, unlikeVideo } from "../../services/videoService";
import toast from "react-hot-toast";

const VideoCard = ({ video }) => {
  const { user, isAuthenticated } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likeCount || 0);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const getFullVideoUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/uploads/${url}`;
  };

  const getFullThumbnailUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/uploads/${url}`;
  };

  // Clicking the video: toggle play AND unmute on first click
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // Unmute on first manual play click
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          // If unmuted play fails, retry muted
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        });
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to like videos");
      return;
    }
    try {
      if (isLiked) {
        await unlikeVideo(video.id);
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await likeVideo(video.id);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to like/unlike video");
    }
  };

  // Autoplay muted when scrolled into view
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Always autoplay muted (browser requirement)
          videoEl.muted = true;
          setIsMuted(true);
          videoEl
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else {
          videoEl.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(videoEl);
    return () => observer.unobserve(videoEl);
  }, []);

  const handleVideoError = () => {
    console.error("Video failed to load. URL tried:", getFullVideoUrl(video.videoUrl));
    setVideoError(true);
  };

  const videoUrl = getFullVideoUrl(video.videoUrl);
  const thumbnailUrl = getFullThumbnailUrl(video.thumbnailUrl);

  return (
    <div className="mb-8 flex border-b border-gray-200 pb-8">
      <div className="mr-4">
        <Link href={`/profile/${video.user?.id}`}>
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <img
              src={video.user?.avatar || "https://via.placeholder.com/150"}
              alt={video.user?.username}
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      </div>

      <div className="flex-1">
        <div className="mb-3">
          <Link href={`/profile/${video.user?.id}`} className="font-semibold hover:underline">
            {video.user?.username}
          </Link>
          <p className="mt-1">{video.caption}</p>
          {video.sound && (
            <p className="mt-1 flex items-center text-sm">
              <FaMusic className="mr-1" /> {video.sound}
            </p>
          )}
        </div>

        <div className="flex">
          <div className="relative mr-4 h-[600px] w-[336px] overflow-hidden rounded-lg bg-black">
            {!videoError && videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onClick={togglePlay}
                  className="h-full w-full object-contain cursor-pointer"
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  poster={thumbnailUrl || undefined}
                  onError={handleVideoError}
                />

                {/* Mute button */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 z-10 rounded-full bg-black bg-opacity-60 p-2 text-white transition-all hover:bg-opacity-90"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                </button>

                {/* Tap to unmute hint — shows when muted and playing */}
                {isMuted && isPlaying && (
                  <div className="absolute bottom-14 right-2 z-10 rounded-full bg-black bg-opacity-60 px-3 py-1 text-xs text-white">
                    Tap video for sound
                  </div>
                )}

                {/* Play button overlay — shows when paused */}
                {!isPlaying && (
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer"
                    onClick={togglePlay}
                  >
                    <div className="rounded-full bg-black bg-opacity-50 p-4 transition-all hover:bg-opacity-75">
                      <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-black p-4 text-center text-white">
                <p className="mb-2">Video unavailable</p>
                <p className="text-sm text-gray-400">Unable to load video</p>
                {video.videoUrl && (
                  <p className="mt-2 break-all text-xs text-gray-500">{video.videoUrl}</p>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col items-center justify-end space-y-4">
            <button
              onClick={handleLike}
              className={`flex flex-col items-center transition-all ${
                isLiked ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              <div className="rounded-full bg-gray-100 p-3 transition-colors hover:bg-gray-200">
                <FaHeart size={20} />
              </div>
              <span className="mt-1 text-xs">{likeCount}</span>
            </button>

            <Link href={`/video/${video.id}`} className="group flex flex-col items-center">
              <div className="rounded-full bg-gray-100 p-3 transition-colors group-hover:bg-gray-200">
                <FaComment size={20} />
              </div>
              <span className="mt-1 text-xs">{video.commentCount || 0}</span>
            </Link>

            <button className="group flex flex-col items-center">
              <div className="rounded-full bg-gray-100 p-3 transition-colors group-hover:bg-gray-200">
                <FaShare size={20} />
              </div>
              <span className="mt-1 text-xs">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;