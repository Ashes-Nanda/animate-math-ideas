
// Cloudinary upload utility for browser environment
// Using the Cloudinary Upload API directly with fetch instead of the Node.js SDK

export const uploadVideo = async (videoFile: File) => {
  try {
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('upload_preset', 'math_animations');
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Helper function to generate a thumbnail URL from a video URL
export const getThumbnailUrl = (videoUrl: string) => {
  if (!videoUrl) return '';
  
  const splitUrl = videoUrl.split('upload/');
  if (splitUrl.length !== 2) return videoUrl;
  
  return `${splitUrl[0]}upload/w_600,h_400,c_fill,g_auto/${splitUrl[1]}`;
};
