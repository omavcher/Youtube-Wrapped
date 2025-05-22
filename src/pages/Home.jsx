import { Link } from 'react-router-dom';
import { getCurrentYear } from '../utils/helpers';
import './Home.css';

const Home = () => {
  const currentYear = getCurrentYear();

  return (
    <div className="home">
      <div className="home-content">
        <h1 className="home-title">
          <span className="gradient-text">YouTube Wrapped</span>
          <span className="year-text">{currentYear}</span>
        </h1>
        
        <p className="home-description">
          Create your personalized YouTube journey recap with stunning visuals and animations
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🎬</span>
            <h3>Video Highlights</h3>
            <p>Relive your best moments and achievements</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Channel Stats</h3>
            <p>View your growth and engagement metrics</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>Top Content</h3>
            <p>Discover your most successful videos</p>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/input" className="cta-button primary">
            Create Your Wrapped
          </Link>
          <Link to="/wrapped" className="cta-button secondary">
            View Demo
          </Link>
        </div>

        <div className="floating-elements">
          {['🎥', '📱', '💻', '🎮', '🎯', '🚀', '🔥', '💫', '⭐'].map((emoji, index) => (
            <span key={index} className="floating-emoji" style={{ '--delay': `${index * 0.5}s` }}>
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 