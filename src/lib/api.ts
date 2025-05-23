import axios from 'axios';

// Get the current port from the window location
const getApiBaseUrl = () => {
  // Ensure the frontend always targets the backend's designated port
  return "http://localhost:5001";
};

export interface AnimationResponse {
  id: string;
  video_url: string;
}

export const generateAnimation = async (
  prompt: string,
  level: string = "intermediate",
  style: string = "educational"
): Promise<AnimationResponse> => {
  const response = await axios.post(`${getApiBaseUrl()}/generate`, {
    prompt,
    level,
    style
  });
  return response.data;
};

export const getVideoUrl = (animationId: string, filename: string): string => {
  return `${getApiBaseUrl()}/videos/${animationId}/${filename}`;
}; 