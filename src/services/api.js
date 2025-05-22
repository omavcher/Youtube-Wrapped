import axios from 'axios';

const API_BASE_URL = 'https://youtube-wrapped.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// YouTube APIs
export const youtubeAPI = {
  getWrapped: (channelId) => api.get(`/youtube/wrapped/${channelId}`),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 
