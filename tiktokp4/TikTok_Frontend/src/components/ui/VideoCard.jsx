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
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const getFullVideoUrl = (url) => {
    if (!url) return null;
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8000${url}`;
    }
    
    return `http://localhost:8000/${url}`;
  };

  const getFullThumbnailUrl = (url) => {
    if (!url) return null;
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8000${url}`;
    }
    
    return `http://localhost:8000/${url}`;
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Error playing video:", error);
            });
        }
      }
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

  useEffect(() => {
    if (!videoRef.current) return;

    let isPaused = false;
    let timeoutId = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting) {
          if (timeoutId) clearTimeout(timeoutId);
          
          timeoutId = setTimeout(() => {
            if (videoRef.current && !isPaused && videoRef.current.readyState >= 3) {
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    setIsPlaying(true);
                  })
                  .catch((error) => {
                    console.error("Autoplay prevented:", error);
                    setIsPlaying(false);
                  });
              }
            }
          }, 100);
        } else {
          if (videoRef.current) {
            isPaused = true;
            videoRef.current.pause();
            setIsPlaying(false);
            setTimeout(() => {
              isPaused = false;
            }, 200);
          }
        }
      },
      { threshold: 0.5 }
    );

    const currentVideo = videoRef.current;
    if (currentVideo) {
      observer.observe(currentVideo);
    }

    return () => {
      if (currentVideo) {
        observer.unobserve(currentVideo);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleVideoError = (e) => {
    console.error("Video failed to load:", video.videoUrl);
    console.error("Full URL attempted:", getFullVideoUrl(video.videoUrl));
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
          <Link
            href={`/profile/${video.user?.id}`}
            className="font-semibold hover:underline"
          >
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
                  onClick={togglePlay}
                  className="h-full w-full object-contain"
                  loop
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  poster={thumbnailUrl || undefined}
                  onError={handleVideoError}
                  crossOrigin="anonymous"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <button 
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-75 transition-all z-10"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                </button>

                {!isPlaying && (
                  <div 
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer"
                    onClick={togglePlay}
                  >
                    <div className="rounded-full bg-black bg-opacity-50 p-4 hover:bg-opacity-75 transition-all">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-black text-white p-4 text-center">
                <p className="mb-2">Video unavailable</p>
                <p className="text-sm text-gray-400">Unable to load video</p>
                {video.videoUrl && (
                  <p className="text-xs text-gray-500 mt-2 break-all">
                    {video.videoUrl}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-end space-y-4">
            <button
              onClick={handleLike}
              className={`flex flex-col items-center transition-all ${
                isLiked ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              <div className="rounded-full bg-gray-100 p-3 hover:bg-gray-200 transition-colors">
                <FaHeart size={20} />
              </div>
              <span className="mt-1 text-xs">{likeCount}</span>
            </button>

            <Link
              href={`/video/${video.id}`}
              className="flex flex-col items-center group"
            >
              <div className="rounded-full bg-gray-100 p-3 group-hover:bg-gray-200 transition-colors">
                <FaComment size={20} />
              </div>
              <span className="mt-1 text-xs">{video.commentCount || 0}</span>
            </Link>

            <button className="flex flex-col items-center group">
              <div className="rounded-full bg-gray-100 p-3 group-hover:bg-gray-200 transition-colors">
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