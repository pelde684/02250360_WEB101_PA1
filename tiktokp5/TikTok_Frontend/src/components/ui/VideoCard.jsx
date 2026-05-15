"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaComment, FaShare, FaMusic, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useAuth } from "../../contexts/authContext";
import { likeVideo, unlikeVideo } from "../../services/videoService";
import toast from "react-hot-toast";

const getFullVideoUrl = (url) => {
  if (!url) return "";
  // If it's already a full URL (starts with http:// or https://), return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // Otherwise, it's a local path - but we're using Supabase now, so this shouldn't happen
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  return `${apiUrl}${url}`;
};

const VideoCard = ({ video }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [likeCount, setLikeCount] = useState(video.likeCount || 0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const videoUrl = getFullVideoUrl(video.videoUrl);
  const thumbnailUrl = video.thumbnailUrl ? getFullVideoUrl(video.thumbnailUrl) : null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch((e) => console.log("Autoplay prevented:", e));
            setIsPlaying(true);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((e) => console.log("Play error:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like videos");
      return;
    }
    try {
      if (isLiked) {
        await unlikeVideo(video.id);
        setLikeCount(likeCount - 1);
        setIsLiked(false);
      } else {
        await likeVideo(video.id);
        setLikeCount(likeCount + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to like video");
    }
  };

  const handleVideoError = (e) => {
    console.error("Video failed to load:", videoUrl);
    setVideoError(true);
    toast.error("Video failed to load");
  };

  if (videoError) {
    return (
      <div className="relative bg-black rounded-xl overflow-hidden">
        <div className="flex items-center justify-center h-[600px] bg-gray-900">
          <div className="text-center text-white">
            <p className="mb-2">⚠️ Video unavailable</p>
            <p className="text-sm text-gray-400">URL: {videoUrl?.substring(0, 50)}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-xl overflow-hidden">
      {/* Video */}
      <div className="relative flex justify-center items-center h-[600px]">
        <video
          ref={videoRef}
          onClick={togglePlay}
          className="h-full w-full object-contain"
          loop
          muted={isMuted}
          playsInline
          src={videoUrl}
          poster={thumbnailUrl || undefined}
          onError={handleVideoError}
        />

        {/* Mute button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition"
        >
          {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
        </button>
      </div>

      {/* Caption */}
      {video.caption && (
        <div className="absolute bottom-20 left-4 right-20 text-white">
          <p className="text-sm">{video.caption}</p>
        </div>
      )}

      {/* Right side actions */}
      <div className="absolute bottom-20 right-4 flex flex-col items-center gap-4">
        <button onClick={handleLike} className="flex flex-col items-center">
          <div className={`rounded-full p-2 ${isLiked ? "bg-red-500" : "bg-black/50"} text-white`}>
            <FaHeart size={24} className={isLiked ? "text-white" : ""} />
          </div>
          <span className="text-white text-xs mt-1">{likeCount}</span>
        </button>

        <Link href={`/video/${video.id}`}>
          <button className="flex flex-col items-center">
            <div className="rounded-full bg-black/50 p-2 text-white">
              <FaComment size={24} />
            </div>
            <span className="text-white text-xs mt-1">{video.commentCount || 0}</span>
          </button>
        </Link>

        <button className="flex flex-col items-center">
          <div className="rounded-full bg-black/50 p-2 text-white">
            <FaShare size={24} />
          </div>
        </button>

        {video.audioName && (
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-black/50 p-2 text-white">
              <FaMusic size={24} />
            </div>
            <span className="text-white text-xs mt-1 truncate w-12 text-center">
              {video.audioName}
            </span>
          </div>
        )}
      </div>

      {/* User info */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <Link href={`/profile/${video.user?.id}`}>
          <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
            {video.user?.avatar ? (
              <img src={video.user.avatar} alt={video.user.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-sm">
                {video.user?.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </Link>
        <Link href={`/profile/${video.user?.id}`}>
          <span className="text-white font-semibold text-sm">@{video.user?.username}</span>
        </Link>
      </div>
    </div>
  );
};

export default VideoCard;