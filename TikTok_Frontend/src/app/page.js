'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('forYou');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true); // true=login, false=signup

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (email, username) => {
    const mockUser = {
      id: Date.now().toString(),
      username: username || email.split('@')[0],
      email: email
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoggedIn(true);
    setUser(mockUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  // Show login/signup page if not logged in
  if (!isLoggedIn) {
    return (
      <AuthPage 
        onLogin={handleLogin} 
        showLogin={showLogin} 
        setShowLogin={setShowLogin}
      />
    );
  }

  // Show main feed if logged in
  return (
    <MainFeed user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
  );
}

// Authentication Page Component
function AuthPage({ onLogin, showLogin, setShowLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!showLogin) {
      // Sign up validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (!formData.username) {
        setError('Username is required');
        return;
      }
    }

    if (!formData.email) {
      setError('Email is required');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    // Successful login/signup
    onLogin(formData.email, formData.username);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black">TikTok</h1>
          <p className="text-gray-500 mt-2">
            {showLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!showLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter username"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter password"
              required
            />
          </div>

          {!showLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Confirm password"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            {showLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setShowLogin(!showLogin);
              setFormData({username: '', email: '', password: '', confirmPassword: ''});
              setError('');
            }}
            className="text-sm text-gray-500 hover:text-black"
          >
            {showLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-xs text-gray-400">
            Demo: Any email and password works
          </p>
        </div>
      </div>
    </div>
  );
}

// Main Feed Component
function MainFeed({ user, onLogout, activeTab, setActiveTab }) {
  const [likedVideos, setLikedVideos] = useState({});
  const [videoLikes, setVideoLikes] = useState({});

  const handleLike = (videoId) => {
    if (likedVideos[videoId]) {
      setLikedVideos({...likedVideos, [videoId]: false});
      setVideoLikes({...videoLikes, [videoId]: (videoLikes[videoId] || 0) - 1});
    } else {
      setLikedVideos({...likedVideos, [videoId]: true});
      setVideoLikes({...videoLikes, [videoId]: (videoLikes[videoId] || 0) + 1});
    }
  };

  const videos = [
    { id: 1, user: 'alex_chen', caption: '🔥 Just dropped my new dance video!', timestamp: '2 hours ago' },
    { id: 2, user: 'sarah_music', caption: '🎵 New song out now! Link in bio', timestamp: '5 hours ago' },
    { id: 3, user: 'travel_adventures', caption: '✈️ Best places to visit this summer', timestamp: '1 day ago' },
    { id: 4, user: 'foodie_delights', caption: '🍜 Making authentic ramen at home', timestamp: '2 days ago' },
    { id: 5, user: 'fitness_guru', caption: '💪 5 minute home workout!', timestamp: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">TikTok</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white text-sm font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-700">@{user.username}</span>
            </div>
            <button 
              onClick={onLogout}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="max-w-2xl mx-auto flex">
          <button
            onClick={() => setActiveTab('forYou')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'forYou'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'following'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Following
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        {activeTab === 'forYou' ? (
          <div className="space-y-4">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                isLiked={likedVideos[video.id] || false}
                likesCount={videoLikes[video.id] || 0}
                onLike={() => handleLike(video.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-500">No videos from people you follow yet</p>
            <p className="text-gray-400 text-sm mt-2">Follow some users to see their content here</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Video Card Component
function VideoCard({ video, isLiked, likesCount, onLike }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Video Player */}
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center cursor-pointer">
        <div className="text-center">
          <div className="text-7xl mb-3">🎬</div>
          <p className="text-gray-400 text-sm">Tap to play video</p>
        </div>
      </div>
      
      {/* Video Info */}
      <div className="p-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {video.user.charAt(0).toUpperCase()}
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">@{video.user}</span>
              <span className="text-xs text-gray-400">• {video.timestamp}</span>
              <button className="ml-auto px-4 py-1 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-800">
                Follow
              </button>
            </div>
            <p className="text-gray-700 text-sm mt-2">{video.caption}</p>
          </div>
          
          {/* Like Button */}
          <button onClick={onLike} className="flex flex-col items-center min-w-[50px]">
            <span className="text-3xl">{isLiked ? '❤️' : '🤍'}</span>
            <span className="text-xs text-gray-500 mt-1">{likesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}