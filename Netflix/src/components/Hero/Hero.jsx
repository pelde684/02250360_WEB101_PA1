/**
 * HERO COMPONENT
 * Featured movie banner displayed at the top of the homepage.
 * Shows large background image with movie title, description, and action buttons.
 */

import React from 'react';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import './Hero.css';

const Hero = ({ movie }) => {
  /**
   * HANDLE PLAY BUTTON
   * Would navigate to video player in a real app
   */
  const handlePlay = () => {
    alert(`Now playing: ${movie.title}\n(This is a demonstration - video playback would start in a real Netflix clone.)`);
  };

  /**
   * HANDLE MORE INFO BUTTON
   * Would open a modal with detailed movie information
   */
  const handleMoreInfo = () => {
    alert(`📽️ ${movie.title}\n\n📅 Year: ${movie.year}\n⭐ Rating: ${movie.rating}\n⏱️ Duration: ${movie.duration}\n\n📝 Description:\n${movie.description}`);
  };

  return (
    <div 
      className="hero" 
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%), url(${movie.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top'
      }}
    >
      <div className="hero-content">
        <h1 className="hero-title">{movie.title}</h1>
        
        <div className="hero-meta">
          <span className="year">{movie.year}</span>
          <span className="rating">{movie.rating}</span>
          <span className="duration">{movie.duration}</span>
        </div>
        
        <p className="hero-description">{movie.description}</p>
        
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={handlePlay}>
            <FaPlay /> Play
          </button>
          <button className="btn btn-secondary" onClick={handleMoreInfo}>
            <FaInfoCircle /> More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;