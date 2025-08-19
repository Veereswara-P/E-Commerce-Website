// backend-service/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from the Authorization header
  const authHeader = req.header('Authorization');

  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({ msg: 'No authorization header, access denied' });
  }

  // Check if the header is in the correct "Bearer <token>" format
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Malformed token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // The payload you signed { id, name, gender }
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};


