import axios from 'axios';

const API_BASE_URLS = [
  'https://youtube-wrapped.onrender.com/api',
  'https://youtube-wrapped-3xi5.onrender.com/api',
];

// Helper function to try endpoints with timeout
const fetchWithFallback = async (path, timeout = 5000) => {
  for (let baseUrl of API_BASE_URLS) {
    try {
      const source = axios.CancelToken.source();
      const timer = setTimeout(() => source.cancel(`Timeout after ${timeout}ms`), timeout);

      const response = await axios.get(`${baseUrl}${path}`, {
        cancelToken: source.token,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timer);
      return response;
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.warn(`Failed at ${baseUrl}, trying next...`);
      } else {
        console.warn(error.message);
      }
    }
  }

  throw new Error('All API base URLs failed');
};

// YouTube APIs
export const youtubeAPI = {
  getWrapped: (channelId) => fetchWithFallback(`/youtube/wrapped/${channelId}`),
};

// Health check
export const healthAPI = {
  check: () => fetchWithFallback('/health'),
};
