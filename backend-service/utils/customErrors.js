// A base class for our custom application errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // To distinguish our errors from programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}

// For 400 Bad Request errors
class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

// For 401 Unauthorized errors
class UnauthorizedError extends AppError {
  constructor(message = 'Authentication failed. Please log in.') {
    super(message, 401);
  }
}

// For 403 Forbidden errors
class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message, 403);
  }
}

// For 404 Not Found errors
class NotFoundError extends AppError {
  constructor(message = 'Resource not found.') {
    super(message, 404);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError
};