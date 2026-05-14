'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getVideoById, addComment, getVideoComments } from '../../../services/videoService';
import { useAuth } from '../../../contexts/authContext';
import toast from 'react-hot-toast';

// Add this URL resolver function at the top
const resolveVideoUrl = (url) => {
  if (!url) return null;
  // If it's already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // If it's a Supabase storage path
  if (url.includes('/storage/v1/object/')) return url;
  // For local backend paths
  return `http://localhost:5001${url.startsWith('/') ? url : `/${url}`}`;
};

export default function VideoPage() {
  const params = useParams();
  const videoId = params.videoId;
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoId) {
      fetchVideo();
      fetchComments();
    }
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      const data = await getVideoById(videoId);
      setVideo(data);
    } catch (error) {
      console.error('Error fetching video:', error);
      toast.error('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getVideoComments(videoId);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    try {
      await addComment(videoId, newComment);
      toast.success('Comment added');
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!video) return <div className="flex justify-center items-center h-screen">Video not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Video Player */}
        <video
          src={resolveVideoUrl(video.videoUrl)}
          className="w-full"
          controls
          autoPlay
          playsInline
          onError={(e) => {
            console.error('Video failed to load:', video.videoUrl);
            e.target.src = 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
          }}
        />
        
        {/* Video Info */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar - Fixed to use resolveVideoUrl or fallback */}
            {video.user?.avatar ? (
              <img
                src={resolveVideoUrl(video.user.avatar)}
                alt={video.user?.username}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.svg';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-semibold">
                  {video.user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold">@{video.user?.username}</p>
              <p className="text-sm text-gray-500">{video.caption}</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Comments ({comments.length})</h3>
            
            {/* Add Comment */}
            {user && (
              <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Post
                </button>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  {/* Comment Avatar - Fixed */}
                  {comment.user?.avatar ? (
                    <img
                      src={resolveVideoUrl(comment.user.avatar)}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.svg';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">
                        {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">@{comment.user?.username}</p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}