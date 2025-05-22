import express from 'express';
import axios from 'axios';

const router = express.Router();
const API_KEY = "AIzaSyBzjOevTicFQgugFYqwzRm8UpeiSmb9R1I";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

// Format large numbers
function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

// Limit text to 50 words
function limitTo50Words(text) {
  if (!text) return "No description available";
  const words = text.split(/\s+/);
  if (words.length <= 50) return text;
  return words.slice(0, 50).join(' ') + '...';
}

function limitTo20Words(text) {
  if (!text) return "No description available";
  const words = text.split(/\s+/);
  if (words.length <= 20) return text;
  return words.slice(0, 20).join(' ') + '...';
}

// ISO Duration to seconds
function isoDurationToSeconds(duration) {
  if (!duration) return 0;
  const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = parseInt(match?.[1] || 0);
  const seconds = parseInt(match?.[2] || 0);
  return minutes * 60 + seconds;
}

// Time since function
function timeSince(date) {
  if (!date) return "Unknown";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}

// Calculate years since join
function getYearsSince(date) {
  if (!date) return "Unknown";
  const joinDate = new Date(date);
  const now = new Date();
  const years = now.getFullYear() - joinDate.getFullYear();
  return years;
}

// Get Channel Stats
async function getChannelStats(channelId) {
  try {
    const res = await axios.get(`${BASE_URL}/channels`, {
      params: {
        key: API_KEY,
        id: channelId,
        part: "snippet,statistics,contentDetails,topicDetails",
      },
    });

    const data = res.data.items?.[0];
    if (!data) throw new Error("Channel data not found");

    const rawCategory = data.topicDetails?.topicCategories?.[0] || "N/A";
    const formattedCategory = rawCategory === "N/A" 
      ? "N/A" 
      : rawCategory.split('/').pop().replace(/_/g, ' ');

    return {
      channelName: data.snippet?.title || "Unknown Channel",
      channelIcon: data.snippet?.thumbnails?.high?.url || "none",
      subscriberCount: data.statistics?.subscriberCount,
      totalViews: data.statistics?.viewCount,
      videoCount: data.statistics?.videoCount,
      uploadsPlaylistId: data.contentDetails?.relatedPlaylists?.uploads || "none",
      about: data.snippet?.description || "none",
      country: data.snippet?.country || "Unknown",
      joinDate: data.snippet?.publishedAt || "Unknown",
      yearsSinceJoin: getYearsSince(data.snippet?.publishedAt),
      category: formattedCategory,
    };
  } catch (err) {
    throw new Error(`Failed to fetch channel stats: ${err.message}`);
  }
}

// Get Channel ID by Name
async function getChannelIdByName(name) {
  try {
    const res = await axios.get(`${BASE_URL}/search`, {
      params: {
        key: API_KEY,
        q: name,
        type: "channel",
        part: "snippet",
        maxResults: 1,
      },
    });

    if (res.data.items.length === 0) throw new Error("Channel not found");
    return res.data.items[0].id.channelId;
  } catch (err) {
    throw new Error(`Failed to fetch channel ID: ${err.message}`);
  }
}

// Get Recent Videos
async function getRecentVideos(playlistId, maxResults = 50) {
  if (!playlistId || playlistId === "none") return [];
  try {
    const res = await axios.get(`${BASE_URL}/playlistItems`, {
      params: {
        key: API_KEY,
        playlistId,
        part: "snippet,contentDetails",
        maxResults,
      },
    });

    return res.data.items.map(item => ({
      title: item.snippet?.title || "Untitled Video",
      videoId: item.snippet?.resourceId?.videoId || "none",
      thumbnail: item.snippet?.thumbnails?.high?.url || "none",
      publishedAt: item.snippet?.publishedAt || "Unknown",
    }));
  } catch (err) {
    console.error("Recent videos fetch error:", err.message);
    return [];
  }
}

// Get Video Details
async function getVideoDetails(videoIds = []) {
  if (videoIds.length === 0) return [];

  try {
    const res = await axios.get(`${BASE_URL}/videos`, {
      params: {
        key: API_KEY,
        id: videoIds.join(","),
        part: "snippet,statistics,contentDetails",
      },
    });

    return res.data.items.map(item => ({
      title: item.snippet?.title || "Untitled Video",
      videoId: item.id || "none",
      publishedAt: item.snippet?.publishedAt || "Unknown",
      thumbnail: item.snippet?.thumbnails?.high?.url || "none",
      views: parseInt(item.statistics?.viewCount || 0),
      likes: parseInt(item.statistics?.likeCount || 0),
      comments: parseInt(item.statistics?.commentCount || 0),
      duration: item.contentDetails?.duration || "PT0S",
    }));
  } catch (err) {
    console.error("Video details fetch error:", err.message);
    return [];
  }
}

// Get Top Comments
async function getTopComments(videoId, maxResults = 10) {
  if (!videoId || videoId === "none") return [];
  try {
    const res = await axios.get(`${BASE_URL}/commentThreads`, {
      params: {
        key: API_KEY,
        videoId,
        part: "snippet",
        maxResults,
      },
    });

    return res.data.items.map(item => {
      const c = item.snippet?.topLevelComment?.snippet;
      return {
        text: limitTo20Words(c?.textDisplay || "No comment text"),
        author: c?.authorDisplayName || "Anonymous",
        authorImage: c?.authorProfileImageUrl || "none",
        publishedAt: timeSince(c?.publishedAt),
      };
    });
  } catch (err) {
    console.error("Comment fetch error:", err.message);
    return [];
  }
}

// Get Playlists
async function getPlaylists(channelId, maxResults = 3) {
  try {
    const res = await axios.get(`${BASE_URL}/playlists`, {
      params: {
        key: API_KEY,
        channelId,
        part: "snippet",
        maxResults,
      },
    });

    if (res.data.items.length === 0) return ["none"];

    return res.data.items.map(p => ({
      title: p.snippet?.title || "Untitled Playlist",
      playlistId: p.id || "none",
      thumbnail: p.snippet?.thumbnails?.high?.url || "none",
    }));
  } catch (err) {
    console.error("Playlists fetch error:", err.message);
    return ["none"];
  }
}

// Main Route
router.get('/wrapped/:channelName', async (req, res) => {
  try {
    const { channelName } = req.params;

    const channelId = await getChannelIdByName(channelName);
    const channel = await getChannelStats(channelId);

    const playlists = await getPlaylists(channelId);

    const recent = await getRecentVideos(channel.uploadsPlaylistId, 50);
    const details = await getVideoDetails(recent.map(v => v.videoId));

    const currentYear = new Date().getFullYear();
    const filtered = details.filter(video => {
      const year = new Date(video.publishedAt).getFullYear();
      const durationSec = isoDurationToSeconds(video.duration);
      return year === currentYear && durationSec > 120;
    });

    filtered.sort((a, b) => b.views - a.views);
    const topVideo = filtered[0] || null;

    let comments = [];
    if (topVideo?.videoId) {
      comments = await getTopComments(topVideo.videoId);
    }

    const response = {
      channelInfo: {
        name: channel.channelName,
        icon: channel.channelIcon,
        subscribers: (channel.subscriberCount),
        totalViews: formatNumber(channel.totalViews),
        totalVideos: channel.videoCount,
        about: limitTo50Words(channel.about),
        category: channel.category,
        country: channel.country,
        joinedAt: channel.joinDate,
        yearsOnYoutube: channel.yearsSinceJoin + " years",
      },
      topPlaylists: playlists,
      topVideo: topVideo
        ? {
            title: topVideo.title,
            publishedAt: topVideo.publishedAt,
            videoLink: `https://www.youtube.com/watch?v=${topVideo.videoId}`,
            thumbnail: topVideo.thumbnail,
            views: formatNumber(topVideo.views),
            likes: formatNumber(topVideo.likes),
            comments: formatNumber(topVideo.comments),
            commentDetails: comments,
          }
        : { message: "none" },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching YouTube data:", error.message);
    res.status(error.message === "Channel not found" ? 404 : 500).json({
      error: "Failed to fetch YouTube data",
      message: error.message,
    });
  }
});

export const youtubeRoutes = router;
