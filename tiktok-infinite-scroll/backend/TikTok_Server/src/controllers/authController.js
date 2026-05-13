const jwt = require('jsonwebtoken');

// In-memory user storage
const users = [];

const signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    
    console.log('Signup attempt:', { username, email });
    
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password
    };
    users.push(newUser);
    
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, username: newUser.username },
      'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: { id: newUser.id, username, email }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });
    console.log('Existing users:', users.map(u => ({ email: u.email, password: u.password })));
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

const testConnection = (req, res) => {
  res.json({ 
    success: true, 
    message: 'Mock mode - no database required',
    userCount: users.length
  });
};

module.exports = { signup, login, testConnection };