const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendSuccess } = require('../utils/responseHandler');
const { BadRequestError, NotFoundError } = require('../utils/customErrors');

// Helper function to generate a JWT, now includes the user's role
const generateToken = (user) => {
  const payload = { 
    id: user.customer_id, 
    name: user.customer_name, 
    role: user.role // Add role to the token payload
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Registers a new customer
exports.register = async (req, res, next) => {
  const { name, email, password, gender } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // The RETURNING clause now includes the 'role' field
    const { rows } = await pool.query(
      'INSERT INTO customer (customer_name, customer_email, customer_password, customer_gender) VALUES ($1, $2, $3, $4) RETURNING customer_id, customer_name, customer_email, customer_gender, role',
      [name, email, hashedPassword, gender]
    );

    const newUser = rows[0];
    const token = generateToken(newUser);
    
    sendSuccess(res, 201, { token, user: newUser }, 'Account created successfully.');
  } catch (err) {
    if (err.message.includes('duplicate key value')) {
        return next(new BadRequestError('An account with this email already exists.'));
    }
    next(err);
  }
};

// Logs in a customer
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Select all fields, including the new 'role'
    const { rows } = await pool.query('SELECT * FROM customer WHERE customer_email = $1', [email]);
    const user = rows[0];

    if (!user) {
        throw new BadRequestError('Invalid credentials.');
    }

    const isMatch = await bcrypt.compare(password, user.customer_password);
    if (!isMatch) {
        throw new BadRequestError('Invalid credentials.');
    }
    
    const token = generateToken(user);

    // Remove the password before sending the user object in the response
    delete user.customer_password;
    
    sendSuccess(res, 200, { token, user });
  } catch (err) {
    next(err);
  }
};

// Updates the profile of the currently logged-in user
exports.updateProfile = async (req, res, next) => {
  const { name, email } = req.body;
  const customerId = req.user.id; 

  try {
    const { rows } = await pool.query(
      'UPDATE customer SET customer_name = $1, customer_email = $2 WHERE customer_id = $3 RETURNING customer_id, customer_name, customer_email, customer_gender, role',
      [name, email, customerId]
    );

    if (rows.length === 0) {
      throw new NotFoundError('User not found.');
    }

    sendSuccess(res, 200, { user: rows[0] }, 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
};

// Logs out the customer
exports.logout = (req, res) => {
  // Logout is a simple client-side action, so a direct response is fine.
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

// Gets the currently logged-in user's data
// Gets the currently logged-in user's data
exports.getMe = async (req, res, next) => {
  try {
    // --- FIX: Add the 'role' column to the SELECT statement ---
    const { rows } = await pool.query(
        'SELECT customer_id, customer_name, customer_email, customer_gender, role FROM customer WHERE customer_id = $1', 
        [req.user.id]
    );
    
    if (rows.length === 0) {
      throw new NotFoundError('User not found');
    }
    sendSuccess(res, 200, rows[0]);
  } catch (err) {
    next(err);
  }
};

// Deletes the currently logged-in user's account
exports.deleteUser = async (req, res, next) => {
  const customerId = req.user.id;
  try {
    await pool.query('DELETE FROM customer WHERE customer_id = $1', [customerId]);
    sendSuccess(res, 200, null, 'Account deleted successfully.');
  } catch (err) {
    next(err);
  }
};