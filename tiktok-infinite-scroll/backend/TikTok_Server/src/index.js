const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware to see all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health checks
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// SIGNUP ROUTE
app.post('/api/auth/signup', (req, res) => {
  console.log('Signup request received:', req.body);
  const { username, email, password, confirmPassword } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  
  // Mock successful signup
  res.json({
    success: true,
    message: 'User created successfully',
    token: 'mock-jwt-token-12345',
    user: {
      id: Date.now().toString(),
      username: username,
      email: email
    }
  });
});

// LOGIN ROUTE
app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  // Mock successful login
  res.json({
    success: true,
    message: 'Login successful',
    token: 'mock-jwt-token-12345',
    user: {
      id: Date.now().toString(),
      username: email.split('@')[0],
      email: email
    }
  });
});

// VIDEOS ROUTE
app.get('/api/videos', (req, res) => {
  console.log('Videos request received');
  res.json({
    videos: [
      {
        id: '1',
        title: 'Sample Video 1',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        user: { username: 'demo_user' }
      }
    ],
    nextCursor: null,
    hasNextPage: false
  });
});

// Catch all 404 - MUST be at the end
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.url}`,
    availableEndpoints: {
      'POST /api/auth/signup': 'Create a new user',
      'POST /api/auth/login': 'Login user',
      'GET /api/videos': 'Get all videos',
      'GET /api/health': 'Health check',
      'GET /api/test': 'Test endpoint'
    }
  });
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/signup`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET  http://localhost:${PORT}/api/videos`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   GET  http://localhost:${PORT}/api/test\n`);
});