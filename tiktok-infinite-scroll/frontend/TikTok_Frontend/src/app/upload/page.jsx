'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/authContext';
import { uploadVideoToStorage, uploadThumbnailToStorage, createVideo } from '../../services/uploadService';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size too large (max 100MB)');
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    toast.success(`Selected: ${file.name}`);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error('Please select a video');
      return;
    }

    if (!caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    if (!user || !user.id) {
      toast.error('User not found. Please login again.');
      return;
    }

    try {
      setUploading(true);
      
      // Step 1: Upload video
      setUploadStatus('Uploading video to cloud...');
      toast.loading('Uploading video...');
      
      const videoResult = await uploadVideoToStorage(user.id, videoFile);
      console.log('Video upload result:', videoResult);
      
      // Step 2: Upload thumbnail (if provided)
      let thumbnailResult = null;
      if (thumbnailFile) {
        setUploadStatus('Uploading thumbnail...');
        thumbnailResult = await uploadThumbnailToStorage(user.id, thumbnailFile);
        console.log('Thumbnail upload result:', thumbnailResult);
      }
      
      // Step 3: Save to database
      setUploadStatus('Saving video information...');
      const videoData = {
        caption,
        videoUrl: videoResult.url,
        videoStoragePath: videoResult.storagePath,
        thumbnailUrl: thumbnailResult?.url || null,
        thumbnailStoragePath: thumbnailResult?.storagePath || null,
      };
      
      await createVideo(videoData);
      
      toast.success('Video uploaded successfully!');
      setUploadStatus('');
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload video');
      setUploadStatus('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Video *</label>
          <div
            onClick={() => videoInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
          >
            {videoPreview ? (
              <video src={videoPreview} className="max-h-64 mx-auto rounded" controls />
            ) : (
              <div>
                <div className="text-4xl mb-2">🎥</div>
                <p className="text-gray-500">Click to select video</p>
                <p className="text-xs text-gray-400 mt-1">MP4, WebM (max 100MB)</p>
              </div>
            )}
          </div>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="hidden"
          />
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail (Optional)</label>
          <div
            onClick={() => thumbnailInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition"
          >
            {thumbnailPreview ? (
              <img src={thumbnailPreview} className="max-h-32 mx-auto rounded" alt="Thumbnail" />
            ) : (
              <div>
                <div className="text-2xl mb-1">🖼️</div>
                <p className="text-gray-500 text-sm">Click to select thumbnail</p>
              </div>
            )}
          </div>
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="hidden"
          />
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium mb-2">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Write a caption..."
            maxLength="150"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{caption.length}/150</p>
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">{uploadStatus}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || !videoFile}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {uploading ? 'Uploading...' : 'Post Video'}
        </button>
      </form>
    </div>
  );
}