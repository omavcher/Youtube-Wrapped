import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@remotion/player';
import { getCurrentYear } from '../utils/helpers';
import VideoComposition from '../components/VideoComposition';
import './WrappedVideo.css';

const WrappedVideo = () => {
  const navigate = useNavigate();
  const currentYear = getCurrentYear();
  const [wrappedData, setWrappedData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem('wrappedData');
    if (!storedData) {
      setError('No wrapped data found. Please generate your wrapped first.');
      return;
    }

    try {
      setWrappedData(JSON.parse(storedData));
    } catch (err) {
      setError('Error loading wrapped data. Please try again.');
    }
  }, []);

  const handleShare = async (platform) => {
    if (!wrappedData) return;

    const { channelInfo, topVideo } = wrappedData;
    const shareText = `Check out my ${currentYear} YouTube Wrapped! 🎬\n\n` +
      `Channel: ${channelInfo.name}\n` +
      `Subscribers: ${channelInfo.subscribers}\n` +
      `Top Video: ${topVideo.title}\n` +
      `Views: ${topVideo.views}\n\n` +
      `#YouTubeWrapped #${currentYear}Wrapped`;

    const shareUrl = encodeURIComponent(window.location.href);

    if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${shareUrl}`;
      window.open(twitterUrl, '_blank');
    } else if (platform === 'instagram') {
      // For Instagram, we'll create a downloadable image that users can post
      try {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = 1080;
        canvas.height = 1080;
        
        // Fill background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#FF0000');
        gradient.addColorStop(1, '#FFD700');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add decorative elements
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.random() * 10 + 5;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fill();
        }
        
        // Add channel profile image
        const profileImage = new Image();
        profileImage.crossOrigin = 'anonymous';
        profileImage.src = channelInfo.icon;
        
        await new Promise((resolve) => {
          profileImage.onload = () => {
            // Draw circular profile image
            ctx.save();
            ctx.beginPath();
            ctx.arc(540, 200, 100, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(profileImage, 440, 100, 200, 200);
            ctx.restore();

            // Add border to profile image
            ctx.beginPath();
            ctx.arc(540, 200, 100, 0, Math.PI * 2);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 5;
            ctx.stroke();
          };
          resolve();
        });
        
        // Add text with shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Add title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${currentYear} YouTube Wrapped`, canvas.width/2, 350);
        
        // Add channel info
        ctx.font = 'bold 40px Arial';
        ctx.fillText(channelInfo.name, canvas.width/2, 420);
        ctx.font = '35px Arial';
        ctx.fillText(`${channelInfo.subscribers} subscribers`, canvas.width/2, 480);
        
        // Add top video info with background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(140, 520, 800, 200);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 30px Arial';
        ctx.fillText('Top Video:', canvas.width/2, 560);
        ctx.font = '25px Arial';
        
        // Wrap text for video title
        const words = topVideo.title.split(' ');
        let line = '';
        let y = 600;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > 800 && n > 0) {
            ctx.fillText(line, canvas.width/2, y);
            line = words[n] + ' ';
            y += 35;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, canvas.width/2, y);
        
        ctx.font = 'bold 30px Arial';
        ctx.fillText(`${topVideo.views} views`, canvas.width/2, y + 50);
        
        // Add watermark
        ctx.font = '20px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('Made with ❤️ by Om Awchar', canvas.width/2, canvas.height - 80);
        ctx.fillText('wrapped.versal.app', canvas.width/2, canvas.height - 60);
        
        // Add decorative border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 5;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `youtube-wrapped-${currentYear}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 'image/png');
      } catch (err) {
        console.error('Error creating Instagram share image:', err);
        alert('Error creating share image. Please try again.');
      }
    }
  };

  if (error) {
    return (
      <div className="wrapped-video-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/input')} className="back-button">
          Generate New Wrapped
        </button>
      </div>
    );
  }

  if (!wrappedData) {
    return (
      <div className="wrapped-video-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="wrapped-video-container">
      <div className="wrapped-video-header">
        <h1 className="wrapped-video-title">
          Your {currentYear} YouTube Journey
        </h1>
        <p className="wrapped-video-subtitle">
          Relive your best moments and achievements
        </p>
      </div>

      <div className="wrapped-video-wrapper">
        <Player
          component={VideoComposition}
          durationInFrames={1650}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{
            width: '100%',
            height: '100%',
          }}
          controls
          autoPlay
          loop
          inputProps={wrappedData}
        />
      </div>

      <div className="wrapped-video-footer">
        <p className="wrapped-video-note">
          Share your wrapped video with your audience!
        </p>
        <div className="share-buttons">
          <button 
            className="share-button twitter"
            onClick={() => handleShare('twitter')}
          >
            Share on Twitter
          </button>
          <button 
            className="share-button instagram"
            onClick={() => handleShare('instagram')}
          >
            Share on Instagram
          </button>
          <a 
            href="https://github.com/omavcher/Youtube-Wrapped" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="share-button github"
          >
            <svg className="github-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Star on GitHub
          </a>
        </div>
        <button 
          className="home-button"
          onClick={() => navigate('/input')}
        >
          <svg className="home-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>Create Another Wrapped</span>
        </button>

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

export default WrappedVideo; 