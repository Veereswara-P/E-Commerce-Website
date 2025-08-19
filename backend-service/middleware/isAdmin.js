const { ForbiddenError } = require('../utils/customErrors');

const isAdmin = (req, res, next) => {
  // This middleware should run AFTER the standard auth middleware
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  throw new ForbiddenError('Access denied. Admin privileges required.');
};

module.exports = isAdmin;
