import React, { useState } from 'react';
import { FaPlay, FaPlus, FaThumbsUp, FaChevronDown } from 'react-icons/fa';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback image if main image fails to load
  const fallbackImage = `https://via.placeholder.com/300x450/333333/ffffff?text=${encodeURIComponent(movie.title)}`;
  
  // Different image sources to try
  const imageSources = [
    movie.image,
    `https://image.tmdb.org/t/p/w500/${movie.id}.jpg`,
    `https://via.placeholder.com/300x450/e50914/ffffff?text=${encodeURIComponent(movie.title)}`,
    fallbackImage
  ];

  const handleImageError = () => {
    setImageError(true);
  };

  const currentImage = imageError ? fallbackImage : movie.image;

  return (
    <div 
      className={`movie-card-container ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="movie-card">
        <img 
          src={currentImage} 
          alt={movie.title}
          className="movie-card-image"
          loading="lazy"
          onError={handleImageError}
        />
        
        {isHovered && (
          <div className="movie-card-expanded">
            <div className="expanded-preview">
              <img 
                src={currentImage} 
                alt={movie.title}
                className="expanded-image"
                onError={handleImageError}
              />
              <div className="preview-overlay"></div>
            </div>
            
            <div className="movie-info-expanded">
              <div className="action-buttons">
                <button 
                  className="action-btn play-btn"
                  onClick={() => alert(`Now playing: ${movie.title}`)}
                >
                  <FaPlay />
                </button>
                <button 
                  className="action-btn"
                  onClick={() => alert(`Added "${movie.title}" to My List`)}
                >
                  <FaPlus />
                </button>
                <button 
                  className="action-btn"
                  onClick={() => alert(`You liked "${movie.title}"`)}
                >
                  <FaThumbsUp />
                </button>
                <button className="action-btn dropdown-btn">
                  <FaChevronDown />
                </button>
              </div>
              
              <div className="movie-meta-expanded">
                <span className="match">{movie.match}% Match</span>
                <span className="year">{movie.year}</span>
                <span className="hd">HD</span>
              </div>
              
              <div className="movie-genres">
                <span>Action</span>
                <span>Drama</span>
                <span>Thriller</span>
              </div>
              
              <p className="movie-description-preview">
                {movie.description.length > 100 
                  ? movie.description.substring(0, 100) + '...' 
                  : movie.description}
              </p>
            </div>
          </div>
        )}
        
        {!isHovered && (
          <div className="movie-card-overlay">
            <div className="movie-card-info">
              <h4 className="movie-title">{movie.title}</h4>
              <div className="movie-badges">
                <span className="match-badge">{movie.match}%</span>
                <span className="hd-badge">HD</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;