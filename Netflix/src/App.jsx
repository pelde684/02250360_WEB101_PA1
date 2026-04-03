/**
 * MAIN APP COMPONENT
 * This is the root component that orchestrates all other components.
 * It manages:
 * - Navigation state (which page/tab is active)
 * - Content filtering based on navigation selection
 * - Layout structure
 */

import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import MovieRow from './components/MovieRow/MovieRow';
import Footer from './components/Footer/Footer';
import { 
  allMovies, 
  heroMovie, 
  getMoviesByCategory, 
  getMoviesByType,
  searchMovies 
} from './data/movieData';
import './App.css';

function App() {
  // State Management
  const [activeNav, setActiveNav] = useState('home'); // Current active navigation tab
  const [searchResults, setSearchResults] = useState(null); // Search results
  const [isSearching, setIsSearching] = useState(false); // Search mode flag

  /**
   * HANDLE SEARCH FUNCTIONALITY
   * Filters movies based on search term and displays results
   */
  const handleSearch = (searchTerm) => {
    if (searchTerm && searchTerm.trim()) {
      const results = searchMovies(searchTerm);
      setSearchResults(results);
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setSearchResults(null);
    }
  };

  /**
   * CLEAR SEARCH
   * Returns to normal browsing mode
   */
  const clearSearch = () => {
    setIsSearching(false);
    setSearchResults(null);
  };

  /**
   * GET CONTENT BASED ON ACTIVE NAVIGATION
   * This function determines what content to display when the user clicks
   * on different navigation items (Home, TV Shows, Movies, etc.)
   */
  const getContent = () => {
    // If searching, show search results
    if (isSearching && searchResults) {
      return {
        showHero: false,
        rows: [
          { 
            title: `Search Results (${searchResults.length})`, 
            movies: searchResults 
          }
        ]
      };
    }

    // Switch between different navigation tabs
    switch(activeNav) {
      case 'home':
        return {
          showHero: true,
          rows: [
            { title: 'Trending Now', movies: getMoviesByCategory('trending') },
            { title: 'Popular on Netflix', movies: getMoviesByCategory('popular') },
            { title: 'Recommended for You', movies: getMoviesByCategory('movies') },
            { title: 'New Releases', movies: getMoviesByCategory('new') }
          ]
        };
      
      case 'tvshows':
        return {
          showHero: false,
          rows: [
            { title: 'Popular TV Shows', movies: getMoviesByType('tv-show') },
            { title: 'Trending TV Shows', movies: getMoviesByCategory('trending') },
            { title: 'New TV Shows', movies: getMoviesByCategory('new') }
          ]
        };
      
      case 'movies':
        return {
          showHero: false,
          rows: [
            { title: 'Popular Movies', movies: getMoviesByCategory('movies') },
            { title: 'Action Movies', movies: getMoviesByCategory('movies') },
            { title: 'Drama Movies', movies: getMoviesByCategory('movies') }
          ]
        };
      
      case 'new':
        return {
          showHero: false,
          rows: [
            { title: 'New Releases', movies: getMoviesByCategory('new') },
            { title: 'Just Added', movies: getMoviesByCategory('new') },
            { title: 'Coming Soon', movies: getMoviesByCategory('new') }
          ]
        };
      
      case 'mylist':
        return {
          showHero: false,
          rows: [
            { title: 'My Watchlist', movies: getMoviesByCategory('mylist') },
            { title: 'Continue Watching', movies: getMoviesByCategory('mylist') }
          ]
        };
      
      default:
        return {
          showHero: true,
          rows: [
            { title: 'Trending Now', movies: getMoviesByCategory('trending') },
            { title: 'Popular on Netflix', movies: getMoviesByCategory('popular') }
          ]
        };
    }
  };

  const content = getContent();

  return (
    <div className="App">
      {/* Navigation Bar */}
      <Navbar 
        activeNav={activeNav} 
        onNavChange={(nav) => {
          setActiveNav(nav);
          clearSearch(); // Clear search when changing tabs
        }}
        onSearch={handleSearch}
      />
      
      {/* Hero Section - Only shows on homepage */}
      {content.showHero && <Hero movie={heroMovie} />}
      
      {/* Main Content Area - Movie Rows */}
      <main className={`main-content ${!content.showHero ? 'no-hero' : ''}`}>
        {content.rows.map((row, index) => (
          row.movies && row.movies.length > 0 && (
            <MovieRow 
              key={index}
              title={row.title}
              movies={row.movies}
            />
          )
        ))}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;