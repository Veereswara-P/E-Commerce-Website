/**
 * Sends a standardized success response.
 * @param {object} res - The Express response object.
 * @param {number} statusCode - The HTTP status code (e.g., 200 for OK, 201 for Created).
 * @param {object} data - The payload to send in the response.
 * @param {string} [message] - An optional success message.
 */
const sendSuccess = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

module.exports = { sendSuccess };