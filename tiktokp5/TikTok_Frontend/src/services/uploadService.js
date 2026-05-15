import apiClient from '../lib/axios';

export const uploadVideo = async (videoFile, thumbnailFile, caption, onProgress) => {
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('caption', caption);
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile);
  }

  const response = await apiClient.post('/videos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percent);
    },
  });

  return response.data;
};