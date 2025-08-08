// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from httpOnly cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // The payload you signed { id, name, gender }
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};
