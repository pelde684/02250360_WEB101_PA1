/**
 * MOVIE ROW COMPONENT
 * Displays a horizontal scrolling row of movie cards.
 * Features:
 * - Left/right scroll buttons
 * - Horizontal scrolling with smooth animation
 * - Responsive design
 */

import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from '../MovieCard/MovieCard';
import './MovieRow.css';

const MovieRow = ({ title, movies }) => {
  const rowRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  /**
   * CHECK SCROLL POSITION
   * Determines whether to show scroll buttons based on content
   */
  const checkScrollPosition = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  // Check scroll position on mount and when movies change
  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [movies]);

  /**
   * SCROLL FUNCTION
   * Scrolls the movie row left or right
   */
  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;
      
      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
      
      // Update button visibility after scroll
      setTimeout(checkScrollPosition, 300);
    }
  };

  // Don't render if no movies
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="movie-row">
      <h2 className="movie-row-title">{title}</h2>
      
      <div className="movie-row-container">
        {/* Left Scroll Button */}
        {showLeftScroll && (
          <button 
            className="scroll-button scroll-left" 
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>
        )}
        
        {/* Movie Cards Container */}
        <div 
          className="movie-row-list" 
          ref={rowRef}
          onScroll={checkScrollPosition}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        
        {/* Right Scroll Button */}
        {showRightScroll && (
          <button 
            className="scroll-button scroll-right" 
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;