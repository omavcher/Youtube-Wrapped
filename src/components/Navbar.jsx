import { Link } from 'react-router-dom';
import { getCurrentYear } from '../utils/helpers';
import './Navbar.css';

const Navbar = () => {
  const currentYear = getCurrentYear();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-text">YouTube Wrapped</span>
            <span className="brand-year">{currentYear}</span>
          </Link>
          
          <div className="navbar-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/wrapped" className="nav-link">
              My Wrapped
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 