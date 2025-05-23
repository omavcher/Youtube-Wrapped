import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentYear } from '../utils/helpers';
import { youtubeAPI } from '../services/api';
import './ChannelInput.css';

const ChannelInput = () => {
  const navigate = useNavigate();
  const currentYear = getCurrentYear();
  const [channelId, setChannelId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Get wrapped data
      const wrappedResponse = await youtubeAPI.getWrapped(channelId);
      
      // Store data in localStorage for the video component
      localStorage.setItem('wrappedData', JSON.stringify({
        channelInfo: wrappedResponse.data.channelInfo,
        topPlaylists: wrappedResponse.data.topPlaylists,
        topVideo: wrappedResponse.data.topVideo
      }));

      navigate('/wrapped');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch channel data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="channel-input">
      <div className="channel-input-content">
        <h1 className="channel-input-title">
          <span className="gradient-text">Create Your {currentYear} Wrapped</span>
        </h1>
        
        <p className="channel-input-description">
          Enter your YouTube channel ID to generate your personalized wrapped video
        </p>

        <div className="input-card">
          <form onSubmit={handleSubmit} className="input-form">
            <div className="input-group">
              <label htmlFor="channelId">YouTube Channel Name</label>
              <input
                type="text"
                id="channelId"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="Enter your channel name"
                required
              />
              <small className="input-help">
                Enter your channel name (eg:tseries)
              </small>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner" />
              ) : (
                'Generate Wrapped'
              )}
            </button>
          </form>
        </div>

        <div className="features-section">
          <h2>What's Included in Your Wrapped</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3>Channel Stats</h3>
              <p>View your growth and engagement metrics</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🎬</span>
              <h3>Top Videos</h3>
              <p>See your most successful content</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📈</span>
              <h3>Year in Review</h3>
              <p>Track your progress throughout the year</p>
            </div>
          </div>
        </div>

        <div className="floating-elements">
          {['🎥', '📱', '💻', '🎮', '🎯', '🚀', '🔥', '💫', '⭐'].map((emoji, index) => (
            <span key={index} className="floating-emoji" style={{ '--delay': `${index * 0.5}s` }}>
              {emoji}
            </span>
          ))}
        </div>

        <div className="creator-credit">
          <span className="credit-text">Made with ❤️ by</span>
          <a 
            href="https://github.com/omavcher" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="creator-link"
          >
            
Om Avcher

          </a>
        </div>
      </div>
    </div>
  );
};

export default ChannelInput; 
