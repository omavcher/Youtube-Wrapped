import { youtubeApi } from 'youtube-api-v3';
import { config } from '../config/index.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';

// Initialize YouTube API client
const youtube = youtubeApi(config.youtubeApiKey);

export const youtubeService = {
  // Get channel data
  getChannelData: async (channelId) => {
    try {
      const response = await youtube.channels.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: [channelId],
      });

      if (!response.items?.length) {
        throw new AppError('Channel not found', 404);
      }

      const channel = response.items[0];
      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnails: channel.snippet.thumbnails,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount,
        viewCount: channel.statistics.viewCount,
        uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads,
      };
    } catch (error) {
      logger.error('Error fetching channel data:', error);
      throw new AppError('Failed to fetch channel data', 500);
    }
  },

  // Get channel videos
  getChannelVideos: async (channelId, maxResults = 50) => {
    try {
      // First get the uploads playlist ID
      const channelResponse = await youtube.channels.list({
        part: ['contentDetails'],
        id: [channelId],
      });

      if (!channelResponse.items?.length) {
        throw new AppError('Channel not found', 404);
      }

      const uploadsPlaylistId = channelResponse.items[0].contentDetails.relatedPlaylists.uploads;

      // Then get the videos from the uploads playlist
      const videosResponse = await youtube.playlistItems.list({
        part: ['snippet', 'contentDetails'],
        playlistId: uploadsPlaylistId,
        maxResults,
      });

      return videosResponse.items.map(item => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnails: item.snippet.thumbnails,
        publishedAt: item.snippet.publishedAt,
      }));
    } catch (error) {
      logger.error('Error fetching channel videos:', error);
      throw new AppError('Failed to fetch channel videos', 500);
    }
  },

  // Get video statistics
  getVideoStats: async (videoId) => {
    try {
      const response = await youtube.videos.list({
        part: ['statistics', 'snippet'],
        id: [videoId],
      });

      if (!response.items?.length) {
        throw new AppError('Video not found', 404);
      }

      const video = response.items[0];
      return {
        id: video.id,
        title: video.snippet.title,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        commentCount: video.statistics.commentCount,
        publishedAt: video.snippet.publishedAt,
      };
    } catch (error) {
      logger.error('Error fetching video stats:', error);
      throw new AppError('Failed to fetch video statistics', 500);
    }
  },

  // Get channel statistics
  getChannelStats: async (channelId) => {
    try {
      const response = await youtube.channels.list({
        part: ['statistics'],
        id: [channelId],
      });

      if (!response.items?.length) {
        throw new AppError('Channel not found', 404);
      }

      const stats = response.items[0].statistics;
      return {
        subscriberCount: stats.subscriberCount,
        videoCount: stats.videoCount,
        viewCount: stats.viewCount,
      };
    } catch (error) {
      logger.error('Error fetching channel stats:', error);
      throw new AppError('Failed to fetch channel statistics', 500);
    }
  },
};