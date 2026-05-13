const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check - add BOTH /health and /api/health for compatibility
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  console.log('Signup request:', req.body);
  
  // For now, return mock success (since database is not working)
  res.json({
    success: true,
    message: 'User created successfully',
    token: 'mock-token-123',
    user: { username: req.body.username, email: req.body.email }
  });
});

app.post('/api/auth/login', async (req, res) => {
  console.log('Login request:', req.body);
  
  // For now, return mock success
  res.json({
    success: true,
    message: 'Login successful',
    token: 'mock-token-123',
    user: { email: req.body.email, username: 'testuser' }
  });
});

// Video routes - with mock data (bypass database)
app.get('/api/videos', (req, res) => {
  console.log('Videos request received');
  res.json({
    videos: [],
    nextCursor: null,
    hasNextPage: false
  });
});

app.get('/api/videos/test', (req, res) => {
  res.json({ message: 'Video route is working!' });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'TikTok API is running',
    endpoints: {
      health: 'GET /api/health',
      videos: 'GET /api/videos',
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 Test API at http://localhost:${PORT}/api/test`);
  console.log(`🔐 Login at http://localhost:${PORT}/api/auth/login`);
  console.log(`🏥 Health at http://localhost:${PORT}/api/health`);
});

module.exports = app;