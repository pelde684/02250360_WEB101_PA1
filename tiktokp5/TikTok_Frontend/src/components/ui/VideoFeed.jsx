"use client";

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import VideoCard from './VideoCard';
import { getVideos, getFollowingVideos } from '../../services/videoService';
import toast from 'react-hot-toast';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { useAuth } from '../../contexts/authContext';

const VideoFeed = ({ feedType = 'forYou' }) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [loadMoreRef, isLoadMoreVisible] = useIntersectionObserver();

  const queryKey = ['videos', feedType];
  const fetchFn = feedType === 'following' ? getFollowingVideos : getVideos;

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchFn({ cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor || null,
    enabled: feedType !== 'following' || isAuthenticated,
  });

  useEffect(() => {
    if (isLoadMoreVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isLoadMoreVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load videos. Please try again.');
      console.error('Error loading videos:', error);
    }
  }, [error]);

  if (status === 'pending' && !data) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (status === 'error' && !data) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load videos</p>
        <button
          onClick={() => fetchNextPage()}
          className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  const videos = data?.pages.flatMap((page) => page.videos || []) || [];

  if (feedType === 'following' && videos.length === 0 && !isFetchingNextPage) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Follow some users to see their videos here!</p>
      </div>
    );
  }

  if (videos.length === 0 && !isFetchingNextPage) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No videos found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {videos.map((video, index) => (
        <VideoCard key={`${video.id}-${index}`} video={video} />
      ))}

      {isFetchingNextPage && (
        <div className="flex justify-center py-5">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {hasNextPage && !isFetchingNextPage && (
        <div ref={loadMoreRef} className="h-20" />
      )}

      {!hasNextPage && videos.length > 0 && (
        <div className="text-center py-5 text-gray-500">
          You've reached the end of the feed.
        </div>
      )}
    </div>
  );
};

export default VideoFeed;