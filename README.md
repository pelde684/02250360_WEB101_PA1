# Project Overview

For this assignment, I created a N etflix-inspired web application using React.js. The goal of the project was to recreate the basic look and feel of Netflix while applying the concepts we learned in class.

The application allows users to browse different movie sections, search for titles, and view movie information when hovering over a movie card. It includes several rows such as Trending, Popular, Movies, New & Popular, and My List.

While it is not a real streaming platform, the project focuses on the user interface and demonstrates how React components can be used to build a modern interactive website.

This project helped me practice component-based design, responsive layouts, and managing state in React.

## Technology Stack

For this project, I used React.js version 18.2.0 as the main framework. React makes it easier to build user interfaces by breaking the page into reusable components.

I used Vite version 5.0.8 as the build tool. React has moved away from Create React App, and Vite is now a faster and more modern alternative. Vite starts the development server quickly and provides faster updates while coding.

For icons, I used React Icons version 5.0.1. This library provided icons such as the search icon, bell notification icon, profile icon, scroll arrows, and play buttons.

All styling in the project is written using plain CSS3. I chose not to use frameworks like Bootstrap or Tailwind because I wanted to demonstrate my understanding of writing CSS manually. The styling includes transitions, hover effects, and responsive layouts.

The JavaScript code uses modern ES6 features such as arrow functions, template literals, destructuring, and the spread operator. These features help keep the code cleaner and easier to read.

### Data Source

All movie information is stored in a single file called movieData.js inside the data folder. This file contains an array of 20 movie objects and acts as the main data source for the application.

Each movie object contains several properties:

id – a unique number for each movie
title – the movie or TV show name
image – a poster image URL
year – the release year
rating – content rating such as TV-14, TV-MA, R, or PG-13
category – determines which section the movie appears in
type – indicates whether the content is a movie or TV show
match – recommendation percentage
description – a short summary of the movie

The file also includes helper functions that help manage the movie data.

The getMoviesByCategory function filters movies based on their category.
The getMoviesByType function filters movies based on whether they are TV shows or movies.
The searchMovies function searches movie titles based on what the user types in the search bar.

The application contains several sections of movies:

Trending includes titles such as Stranger Things, The Crown, Wednesday, Money Heist, and Squid Game.

Popular includes The Witcher, Bridgerton, and You.

The Movies section includes Extraction 2, The Gray Man, Don’t Look Up, and Red Notice.

The New & Popular section includes One Piece, Berlin, and The Night Agent.

The My List section includes Breaking Bad, Dark, Ozark, The Queen’s Gambit, and Narcos.

The images used in the project come from picsum.photos, which is a reliable image service. Each movie uses a unique image generated from its ID number so that every card has a different image.

#### Setup Instructions

Before running the project, Node.js version 18 or higher must be installed on the computer. npm is included with Node.js and is required to install project dependencies.

To run the project locally, first clone the repository from GitHub using the command:

git clone <repository-url>

Then navigate to the project folder:

cd 02190108_WEB101_PA1

Next, install all required dependencies:

npm install

This command reads the package.json file and installs everything needed for the project.

After installation is complete, start the development server:

npm run dev

The terminal will display a local address such as:

http://localhost:5173

Opening this address in a browser will show the application running locally.

To create an optimized production build, run:

npm run build

This generates a dist folder containing the production files.

To preview the built version locally:

npm run preview
Responsive Breakpoints

The website is designed to work on different screen sizes using CSS media queries.

For desktop screens larger than 1200 pixels, the full layout is displayed. Navigation links appear across the top bar, and movie cards are sized at about 200 by 300 pixels. The hero section takes up around 80 percent of the screen height. Scroll buttons appear only when the user hovers over the movie row.

For tablet screens between 768 and 1199 pixels, the layout adjusts slightly. Movie cards become smaller so more content fits on the screen. The hero section is reduced to about 60 percent of the screen height. Scroll buttons remain visible to make navigation easier on touch devices.

For mobile screens between 480 and 767 pixels, the navigation menu changes. The navigation links are hidden and replaced by a hamburger menu button. When clicked, the menu appears vertically. Movie cards are reduced in size to about 120 by 180 pixels, and the hero section becomes 50 percent of the screen height.

For very small screens below 480 pixels, font sizes and spacing are reduced so that everything remains readable and properly aligned.

###### Reflection

Working on this Netflix clone was a very useful learning experience. It helped me understand how React applications are structured and how components work together.

I began the project by sketching the component layout on paper before writing any code. This helped me plan how the components would connect and share data.

One thing that worked well was dividing the application into smaller components such as Navbar, Hero, MovieRow, and MovieCard. This made the code more organized and easier to maintain.

The MovieCard component was especially useful because it could be reused many times across different movie rows. This saved a lot of development time.

The responsive design also turned out well. After testing the site on different screen sizes, the layout adjusted smoothly and remained easy to use on both desktop and mobile devices.

During the project, I learned how to organize a React project using folders for components, data, and styles. I also gained more experience with the useState hook for managing UI state such as navigation tabs and search input.

Another important concept I practiced was passing information between components using props. The main App component stores the movie data and passes the necessary information to child components.

###### Challenges Faced

One of the biggest challenges was finding reliable image sources. Many movie poster links from the internet did not allow direct use or required API keys.

Several image links worked temporarily but stopped working later. To solve this problem, I decided to use picsum.photos, which generates random images that always load successfully.

Another challenge was implementing horizontal scrolling for the movie rows. I needed to understand how scroll positions work in JavaScript and how to calculate the correct amount to scroll when the user clicks the arrow buttons.

I used a React ref to access the movie row container and read properties such as scrollLeft, scrollWidth, and clientWidth.

Managing state between components was also confusing at first. The active navigation tab is stored in the App component, but the Navbar component needs to update it when a user clicks a menu item.

I solved this by passing the active tab and a function to update it as props from the App component to the Navbar component.

The search feature also required careful handling. I created a helper function that filters the movie list without changing the original data.

Finally, creating smooth CSS hover animations for movie cards required experimenting with transitions, scaling effects, and z-index positioning to make the expanded card appear above other cards.

###### Conclusion

This project demonstrates my ability to build a React application with reusable components, responsive design, and interactive features.

Through this assignment, I gained a better understanding of React concepts such as components, props, state management, and event handling.

Overall, the project helped strengthen my web development skills and gave me practical experience building a modern user interface.