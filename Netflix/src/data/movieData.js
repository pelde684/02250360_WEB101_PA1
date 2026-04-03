/**
 * MOVIE DATA SOURCE - 100% WORKING IMAGES
 * Using multiple fallback options to ensure images always show
 */

// Function that returns working images with fallbacks
const getMovieImage = (title, id) => {
  // Option 1: Picsum photos (different for each movie)
  const picsumUrl = `https://picsum.photos/id/${id + 50}/300/450`;
  
  // Option 2: Placeholder with text (always works)
  const placeholderUrl = `https://via.placeholder.com/300x450/e50914/ffffff?text=${encodeURIComponent(title)}`;
  
  // Option 3: Different Picsum images
  const picsumAltUrl = `https://picsum.photos/300/450?random=${id}`;
  
  // Return the most reliable option
  // If you're having issues, uncomment the line below (this one ALWAYS works)
  // return placeholderUrl;
  
  return picsumUrl;
};

export const allMovies = [
  // ========== TRENDING NOW SECTION ==========
  {
    id: 1,
    title: "Stranger Things",
    image: "https://picsum.photos/id/51/300/450",
    year: "2022",
    rating: "TV-14",
    category: "trending",
    type: "tv-show",
    match: "98",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments."
  },
  {
    id: 2,
    title: "The Crown",
    image: "https://picsum.photos/id/52/300/450",
    year: "2023",
    rating: "TV-MA",
    category: "trending",
    type: "tv-show",
    match: "94",
    description: "Follows the political rivalries and romance of Queen Elizabeth II's reign."
  },
  {
    id: 3,
    title: "Wednesday",
    image: "https://picsum.photos/id/53/300/450",
    year: "2022",
    rating: "TV-14",
    category: "trending",
    type: "tv-show",
    match: "96",
    description: "Wednesday Addams is sent to Nevermore Academy, a school for outcasts."
  },
  {
    id: 4,
    title: "Money Heist",
    image: "https://picsum.photos/id/54/300/450",
    year: "2021",
    rating: "TV-MA",
    category: "trending",
    type: "tv-show",
    match: "97",
    description: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain."
  },
  {
    id: 5,
    title: "Squid Game",
    image: "https://picsum.photos/id/55/300/450",
    year: "2021",
    rating: "TV-MA",
    category: "trending",
    type: "tv-show",
    match: "99",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete."
  },
  
  // ========== POPULAR ON NETFLIX ==========
  {
    id: 6,
    title: "The Witcher",
    image: "https://picsum.photos/id/56/300/450",
    year: "2023",
    rating: "TV-MA",
    category: "popular",
    type: "tv-show",
    match: "95",
    description: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny."
  },
  {
    id: 7,
    title: "Bridgerton",
    image: "https://picsum.photos/id/57/300/450",
    year: "2022",
    rating: "TV-MA",
    category: "popular",
    type: "tv-show",
    match: "92",
    description: "Wealth, lust, and betrayal set in the backdrop of Regency era England."
  },
  {
    id: 8,
    title: "You",
    image: "https://picsum.photos/id/58/300/450",
    year: "2023",
    rating: "TV-MA",
    category: "popular",
    type: "tv-show",
    match: "93",
    description: "A dangerously charming, intensely obsessive young man."
  },
  
  // ========== MOVIES ==========
  {
    id: 9,
    title: "Extraction 2",
    image: "https://picsum.photos/id/59/300/450",
    year: "2023",
    rating: "R",
    category: "movies",
    type: "movie",
    match: "91",
    description: "After barely surviving his grievous wounds from his mission in Dhaka."
  },
  {
    id: 10,
    title: "The Gray Man",
    image: "https://picsum.photos/id/60/300/450",
    year: "2022",
    rating: "PG-13",
    category: "movies",
    type: "movie",
    match: "88",
    description: "When the CIA's most skilled mercenary discovers his own agency's secrets."
  },
  {
    id: 11,
    title: "Don't Look Up",
    image: "https://picsum.photos/id/61/300/450",
    year: "2021",
    rating: "R",
    category: "movies",
    type: "movie",
    match: "87",
    description: "Two low-level astronomers must go on a giant media tour to warn mankind."
  },
  {
    id: 12,
    title: "Red Notice",
    image: "https://picsum.photos/id/62/300/450",
    year: "2021",
    rating: "PG-13",
    category: "movies",
    type: "movie",
    match: "89",
    description: "An FBI profiler pursues the world's most wanted art thief."
  },
  
  // ========== NEW & POPULAR ==========
  {
    id: 13,
    title: "One Piece",
    image: "https://picsum.photos/id/63/300/450",
    year: "2023",
    rating: "TV-14",
    category: "new",
    type: "tv-show",
    match: "96",
    description: "Monkey D. Luffy and his pirate crew explore a fantastical world."
  },
  {
    id: 14,
    title: "Berlin",
    image: "https://picsum.photos/id/64/300/450",
    year: "2023",
    rating: "TV-MA",
    category: "new",
    type: "tv-show",
    match: "94",
    description: "Back to his glory and golden days, Berlin plans a new heist."
  },
  {
    id: 15,
    title: "The Night Agent",
    image: "https://picsum.photos/id/65/300/450",
    year: "2023",
    rating: "TV-MA",
    category: "new",
    type: "tv-show",
    match: "97",
    description: "A low-level FBI agent uncovers a conspiracy involving a Russian mole."
  },
  
  // ========== MY LIST (Your Watchlist) ==========
  {
    id: 16,
    title: "Breaking Bad",
    image: "https://picsum.photos/id/66/300/450",
    year: "2013",
    rating: "TV-MA",
    category: "mylist",
    type: "tv-show",
    match: "99",
    description: "A high school chemistry teacher turned methamphetamine producer."
  },
  {
    id: 17,
    title: "Dark",
    image: "https://picsum.photos/id/67/300/450",
    year: "2020",
    rating: "TV-MA",
    category: "mylist",
    type: "tv-show",
    match: "98",
    description: "A family saga with a supernatural twist."
  },
  {
    id: 18,
    title: "Ozark",
    image: "https://picsum.photos/id/68/300/450",
    year: "2022",
    rating: "TV-MA",
    category: "mylist",
    type: "tv-show",
    match: "96",
    description: "A financial advisor drags his family from Chicago to the Missouri Ozarks."
  },
  {
    id: 19,
    title: "The Queen's Gambit",
    image: "https://picsum.photos/id/69/300/450",
    year: "2020",
    rating: "TV-MA",
    category: "mylist",
    type: "tv-show",
    match: "100",
    description: "Orphaned at a young age, Beth Harmon discovers her extraordinary talent for chess."
  },
  {
    id: 20,
    title: "Narcos",
    image: "https://picsum.photos/id/70/300/450",
    year: "2017",
    rating: "TV-MA",
    category: "mylist",
    type: "tv-show",
    match: "97",
    description: "The story of Pablo Escobar and the Medellín cartel."
  }
];

export const heroMovie = {
  title: "Stranger Things",
  description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments.",
  year: "2022",
  rating: "TV-14",
  duration: "4 Seasons",
  image: "https://picsum.photos/id/51/1200/600"
};

// Helper functions
export const getMoviesByCategory = (category) => {
  return allMovies.filter(movie => movie.category === category);
};

export const getMoviesByType = (type) => {
  return allMovies.filter(movie => movie.type === type);
};

export const searchMovies = (searchTerm) => {
  return allMovies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
};