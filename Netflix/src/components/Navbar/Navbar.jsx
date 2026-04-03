import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaUser, FaCaretDown } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ activeNav, onNavChange }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleClickOutside = (event) => {
      if (profileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'tvshows', label: 'TV Shows' },
    { id: 'movies', label: 'Movies' },
    { id: 'new', label: 'New & Popular' },
    { id: 'mylist', label: 'My List' }
  ];

  const handleNavClick = (navId) => {
    onNavChange(navId);
    setMobileMenuOpen(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      alert(`Searching for: "${searchTerm}"`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  const profileOptions = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'profiles', label: 'Switch Profiles', icon: '🔄' },
    { id: 'help', label: 'Help Center', icon: '❓' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'logout', label: 'Sign Out', icon: '🚪' }
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-left">
          <div className="logo" onClick={() => handleNavClick('home')}>
            <h1>NETFLIX</h1>
          </div>
          
          <div className="nav-links">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-link ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="nav-right">
          {/* Search */}
          {searchOpen && (
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Titles, people, genres"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                autoFocus
              />
              <button className="search-submit" onClick={handleSearch}>
                <FaSearch />
              </button>
            </div>
          )}
          
          <FaSearch className="nav-icon" onClick={() => setSearchOpen(!searchOpen)} />
          <FaBell className="nav-icon" />
          
          {/* Profile Menu */}
          <div className="profile-menu-container">
            <div 
              className="profile-trigger"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <div className="profile-avatar">
                <FaUser />
              </div>
              <FaCaretDown className={`profile-caret ${profileMenuOpen ? 'open' : ''}`} />
            </div>
            
            {profileMenuOpen && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-avatar-large">
                    <FaUser />
                  </div>
                  <div className="profile-info">
                    <div className="profile-name">Student User</div>
                    <div className="profile-email">student@university.edu</div>
                  </div>
                </div>
                
                <div className="profile-divider"></div>
                
                {profileOptions.map(option => (
                  <button
                    key={option.id}
                    className="profile-option"
                    onClick={() => {
                      alert(`${option.label} clicked!`);
                      setProfileMenuOpen(false);
                    }}
                  >
                    <span className="profile-option-icon">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`mobile-link ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
          <div className="mobile-divider"></div>
          {profileOptions.map(option => (
            <button
              key={option.id}
              className="mobile-link"
              onClick={() => alert(`${option.label} clicked!`)}
            >
              {option.icon} {option.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;