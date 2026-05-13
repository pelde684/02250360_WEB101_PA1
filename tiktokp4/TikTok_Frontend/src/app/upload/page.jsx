'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function UploadPage() {
  const router = useRouter();
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert('Please select a video file');
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('video', videoFile);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
    formData.append('caption', caption);

    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post('http://localhost:8000/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      if (response.data) {
        alert('Video uploaded successfully!');
        router.push('/');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      
      <div className="space-y-4">
        {/* Video File Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Video File *</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            className="w-full p-2 border rounded"
            disabled={uploading}
          />
          {videoFile && (
            <video
              src={URL.createObjectURL(videoFile)}
              controls
              className="mt-2 max-h-48 rounded"
            />
          )}
        </div>

        {/* Thumbnail Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailSelect}
            className="w-full p-2 border rounded"
            disabled={uploading}
          />
          {thumbnailFile && (
            <img
              src={URL.createObjectURL(thumbnailFile)}
              alt="Thumbnail preview"
              className="mt-2 max-h-32 rounded"
            />
          )}
        </div>

        {/* Caption Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Write a caption..."
            disabled={uploading}
          />
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
            <p className="text-sm text-gray-600 mt-1">Uploading: {progress}%</p>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading || !videoFile}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </div>
    </div>
  );
}