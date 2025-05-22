import { AppError } from '../../middleware/errorHandler.js';

export const youtubeController = {
  // Get channel data
  getChannelData: async (req, res, next) => {
    try {
      const { channelId } = req.params;
      
      if (!channelId) {
        throw new AppError('Channel ID is required', 400);
      }

      const channelData = await youtubeService.getChannelData(channelId);
      res.json({
        success: true,
        data: channelData
      });
    } catch (error) {
      next(error);
    }
  },

  // Get channel videos
  getChannelVideos: async (req, res, next) => {
    try {
      const { channelId } = req.params;
      const { maxResults } = req.query;

      if (!channelId) {
        throw new AppError('Channel ID is required', 400);
      }

      const videos = await youtubeService.getChannelVideos(
        channelId,
        maxResults ? parseInt(maxResults) : undefined
      );

      res.json({
        success: true,
        data: videos
      });
    } catch (error) {
      next(error);
    }
  },

  // Get video statistics
  getVideoStats: async (req, res, next) => {
    try {
      const { videoId } = req.params;

      if (!videoId) {
        throw new AppError('Video ID is required', 400);
      }

      const videoStats = await youtubeService.getVideoStats(videoId);
      res.json({
        success: true,
        data: videoStats
      });
    } catch (error) {
      next(error);
    }
  },

  // Get channel statistics
  getChannelStats: async (req, res, next) => {
    try {
      const { channelId } = req.params;

      if (!channelId) {
        throw new AppError('Channel ID is required', 400);
      }

      const channelStats = await youtubeService.getChannelStats(channelId);
      res.json({
        success: true,
        data: channelStats
      });
    } catch (error) {
      next(error);
    }
  },

  // Generate wrapped video
  generateWrappedVideo: async (req, res, next) => {
    try {
      const { channelId } = req.body;

      if (!channelId) {
        throw new AppError('Channel ID is required', 400);
      }

      // Get channel data and videos
      const [channelData, videos] = await Promise.all([
        youtubeService.getChannelData(channelId),
        youtubeService.getChannelVideos(channelId)
      ]);

      // Get video statistics for each video
      const videoStats = await Promise.all(
        videos.map(video => youtubeService.getVideoStats(video.id))
      );

      // Combine all data
      const wrappedData = {
        channel: channelData,
        videos: videoStats,
        generatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        data: wrappedData
      });
    } catch (error) {
      next(error);
    }
  }
};