const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };