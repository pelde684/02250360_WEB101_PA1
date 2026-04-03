/**
 * NAVBAR COMPONENT
 * Reusable navigation component that handles:
 * - Desktop and mobile navigation
 * - Active state highlighting
 * - Search functionality
 * - User profile menu
 * - Responsive hamburger menu
 */

import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaUser, FaCaretDown } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ activeNav, onNavChange, onSearch }) => {
  // State Management
  const [scrolled, setScrolled] = useState(false);     // Navbar background on scroll
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile menu state
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // Profile dropdown
  const [searchOpen, setSearchOpen] = useState(false); // Search bar visibility
  const [searchTerm, setSearchTerm] = useState('');    // Search input value

  /**
   * SCROLL EFFECT
   * Changes navbar background when user scrolls down
   */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * CLICK OUTSIDE HANDLER
   * Closes profile menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [profileMenuOpen]);

  // Navigation items configuration
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'tvshows', label: 'TV Shows' },
    { id: 'movies', label: 'Movies' },
    { id: 'new', label: 'New & Popular' },
    { id: 'mylist', label: 'My List' }
  ];

  // Profile menu options
  const profileOptions = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'profiles', label: 'Switch Profiles', icon: '🔄' },
    { id: 'help', label: 'Help Center', icon: '❓' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'logout', label: 'Sign Out', icon: '🚪' }
  ];

  /**
   * HANDLE NAVIGATION CLICK
   * Updates active navigation and closes mobile menu
   */
  const handleNavClick = (navId) => {
    onNavChange(navId);
    setMobileMenuOpen(false);
  };

  /**
   * HANDLE SEARCH SUBMISSION
   * Triggers search callback and closes search bar
   */
  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  /**
   * HANDLE ENTER KEY PRESS
   * Allows submitting search with Enter key
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* LEFT SECTION - Logo and Navigation Links */}
        <div className="nav-left">
          <div className="logo" onClick={() => handleNavClick('home')}>
            <h1>NETFLIX</h1>
          </div>
          
          {/* Desktop Navigation Links */}
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

        {/* RIGHT SECTION - Icons and Profile */}
        <div className="nav-right">
          {/* Search Bar */}
          {searchOpen && (
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Titles, people, genres"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <button className="search-submit" onClick={handleSearchSubmit}>
                <FaSearch />
              </button>
            </div>
          )}
          
          {/* Search Icon */}
          <FaSearch className="nav-icon" onClick={() => setSearchOpen(!searchOpen)} />
          
          {/* Notification Bell */}
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
            
            {/* Profile Dropdown Menu */}
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
                      alert(`${option.label} - This feature is for demonstration purposes.`);
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

        {/* MOBILE MENU BUTTON - Hamburger icon for mobile view */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU - Shown when hamburger is clicked */}
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
              onClick={() => alert(`${option.label} - This feature is for demonstration purposes.`)}
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