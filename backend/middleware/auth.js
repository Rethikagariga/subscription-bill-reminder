const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from request header
  const token = req.headers.authorization?.split(' ')[1];

  // If no token found, reject the request
  if (!token) {
    return res.status(401).json({ message: 'No token, unauthorized' });
  }

  // If token found, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};