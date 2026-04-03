/**
 * MOVIE DATA SOURCE - COMPLETE WITH WORKING IMAGES
 * All 20 movies have guaranteed working images from reliable sources
 */

// Function to get working images for each movie
const getMovieImage = (title, id) => {
  // Using Lorem Picsum - guaranteed to work 100% of the time
  // Each movie gets a unique image based on its ID
  return `https://picsum.photos/id/${id + 50}/300/450`;
};

export const allMovies = [
  // ========== TRENDING NOW SECTION (5 movies) ==========
  {
    id: 1,
    title: "Stranger Things",
    image: getMovieImage("Stranger Things", 1),
    year: "2022",
    rating: "TV-14",
    category: "trending",
    type: "tv-show",
    match: "98",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl."
  },
  {
    id: 2,
    title: "The Crown",
    image: getMovieImage("The Crown", 2),
    year: "2023",
    rating: "TV-MA",
    category: "trending",
    type: "tv-show",
    match: "94",
    description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century."
  },
  {
    id: 3,
    title: "Wednesday",
    image: getMovieImage("Wednesday", 3),
    year: "2022",
    rating: "TV-14",
    category: "trending",
    type: "tv-show",
    match: "96",
    description: "Wednesday Addams is sent to Nevermore Academy, a school for outcasts, monsters, and misfits."
  },
  {
    id: 4,
    title: "Money Heist",
    image: getMovieImage("Money Heist", 4),
    year: "2021",
    rating: "TV-MA",
    category: "trending",
    type: "tv-show",
    match: "97",
    description: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan."
  },
  {
    id: 5,
    title: "Squid Game",
    image: getMovieImage("Squid Game", 5),
    year: "2021",
    rating: "TV-MA",
    category: "trending",
    type: "tv-show",
    match: "99",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes."
  },
  
  // ========== POPULAR ON NETFLIX SECTION (3 movies) ==========
  {
    id: 6,
    title: "The Witcher",
    image: getMovieImage("The Witcher", 6),
    year: "2023",
    rating: "TV-MA",
    category: "popular",
    type: "tv-show",
    match: "95",
    description: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts."
  },
  {
    id: 7,
    title: "Bridgerton",
    image: getMovieImage("Bridgerton", 7),
    year: "2022",
    rating: "TV-MA",
    category: "popular",
    type: "tv-show",
    match: "92",
    description: "Wealth, lust, and betrayal set in the backdrop of Regency era England, seen through the eyes of the powerful Bridgerton family."
  },
  {
    id: 8,
    title: "You",
    image: getMovieImage("You", 8),
    year: "2023",
    rating: "TV-MA",
    category: "popular",
    type: "tv-show",
    match: "93",
    description: "A dangerously charming, intensely obsessive young man goes to extreme measures to insert himself into the lives of those he is transfixed by."
  },
  
  // ========== MOVIES SECTION (4 movies) ==========
  {
    id: 9,
    title: "Extraction 2",
    image: getMovieImage("Extraction 2", 9),
    year: "2023",
    rating: "R",
    category: "movies",
    type: "movie",
    match: "91",
    description: "After barely surviving his grievous wounds from his mission in Dhaka, Tyler Rake is back, and his team is ready to take on another dangerous mission."
  },
  {
    id: 10,
    title: "The Gray Man",
    image: getMovieImage("The Gray Man", 10),
    year: "2022",
    rating: "PG-13",
    category: "movies",
    type: "movie",
    match: "88",
    description: "When the CIA's most skilled mercenary discovers his own agency's secrets, he becomes the target of a global manhunt."
  },
  {
    id: 11,
    title: "Don't Look Up",
    image: getMovieImage("Don't Look Up", 11),
    year: "2021",
    rating: "R",
    category: "movies",
    type: "movie",
    match: "87",
    description: "Two low-level astronomers must go on a giant media tour to warn mankind of an approaching comet that will destroy planet Earth."
  },
  {
    id: 12,
    title: "Red Notice",
    image: getMovieImage("Red Notice", 12),
    year: "2021",
    rating: "PG-13",
    category: "movies",
    type: "movie",
    match: "89",
    description: "An FBI profiler pursues the world's most wanted art thief, who unexpectedly partners with a rival criminal to pull off a series of heists."
  },
  
  // ========== NEW & POPULAR SECTION (3 movies) ==========
  {
    id: 13,
    title: "One Piece",
    image: getMovieImage("One Piece", 13),
    year: "2023",
    rating: "TV-14",
    category: "new",
    type: "tv-show",
    match: "96",
    description: "Monkey D. Luffy and his pirate crew explore a fantastical world of endless oceans and exotic islands in search of the world's ultimate treasure."
  },
  {
    id: 14,
    title: "Berlin",
    image: getMovieImage("Berlin", 14),
    year: "2023",
    rating: "TV-MA",
    category: "new",
    type: "tv-show",
    match: "94",
    description: "Back to his glory and golden days, Berlin plans a new heist along with a new gang, aiming to pull off a jewel heist in Paris."
  },
  {
    id: 15,
    title: "The Night Agent",
    image: getMovieImage("The Night Agent", 15),
    year: "2023",
    rating: "TV-MA",
    category: "new",
    type: "tv-show",
    match: "97",
    description: "A low-level FBI agent uncovers a conspiracy involving a Russian mole at the highest levels of the US government."
  },
  
  // ========== MY LIST SECTION - YOUR WATCHLIST (5 movies) ==========
  {
    id: 16,
    title: "Breaking Bad",
    image: getMovieImage("Breaking Bad", 16),
    year: "2013",
    rating: "TV-MA",
    category: "mylist",
    type: "tv-show",
    match: "99",
    description: "A high school chemistry teacher turned methamphetamine producer partners with a former student to secure his family's financial future."
  },
  {
    id: 17,
    title: "Dark",
    image: getMovieImage("Dark", 17),
    year: "2020",
    rating: "TV-MA",
    category: "mylist",
    type: "tv-show",
    match: "98",
    description: "A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the fractured relationships."
  },
  {
    id: 18,
    title: "Ozark",
    image: getMovieImage("Ozark", 18),
    year: "2022",
    rating: "TV-MA",
    category: "mylist",
    type: "tv-show",
    match: "96",
    description: "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss."
  },
  {
    id: 19,
    title: "The Queen's Gambit",
    image: getMovieImage("The Queen's Gambit", 19),
    year: "2020",
    rating: "TV-MA",
    category: "mylist",
    type: "tv-show",
    match: "100",
    description: "Orphaned at a young age, Beth Harmon discovers her extraordinary talent for chess while struggling with addiction and personal demons."
  },
  {
    id: 20,
    title: "Narcos",
    image: getMovieImage("Narcos", 20),
    year: "2017",
    rating: "TV-MA",
    category: "mylist",
    type: "tv-show",
    match: "97",
    description: "The true story of Colombia's infamously violent and powerful drug cartels, focusing on Pablo Escobar and the Medellín cartel."
  }
];

// Hero Movie Data - Featured at the top of the homepage
export const heroMovie = {
  title: "Stranger Things",
  description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
  year: "2022",
  rating: "TV-14",
  duration: "4 Seasons",
  image: "https://picsum.photos/id/51/1200/600"
};

// ========== HELPER FUNCTIONS ==========

// Get movies by category (trending, popular, movies, new, mylist)
export const getMoviesByCategory = (category) => {
  return allMovies.filter(movie => movie.category === category);
};

// Get movies by type (tv-show or movie)
export const getMoviesByType = (type) => {
  return allMovies.filter(movie => movie.type === type);
};

// Search movies by title
export const searchMovies = (searchTerm) => {
  return allMovies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Get trending movies (for homepage)
export const getTrendingMovies = () => {
  return allMovies.filter(movie => movie.category === 'trending');
};

// Get popular movies
export const getPopularMovies = () => {
  return allMovies.filter(movie => movie.category === 'popular');
};

// Get new releases
export const getNewReleases = () => {
  return allMovies.filter(movie => movie.category === 'new');
};

// Get user's personal watchlist
export const getMyList = () => {
  return allMovies.filter(movie => movie.category === 'mylist');
};