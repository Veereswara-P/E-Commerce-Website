// backend-service/controllers/authController.js

const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// This helper function now just returns the token, which we can use everywhere.
const generateToken = (user) => {
  return jwt.sign(
    { id: user.customer_id, name: user.customer_name, gender: user.customer_gender },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Registers a new customer.
 */
exports.register = async (req, res) => {
  const { name, email, password, gender } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { rows } = await pool.query(
      'INSERT INTO customer (customer_name, customer_email, customer_password, customer_gender) VALUES ($1, $2, $3, $4) RETURNING customer_id, customer_name, customer_email, customer_gender',
      [name, email, hashedPassword, gender]
    );

    const newUser = rows[0];
    const token = generateToken(newUser);

    // Set httpOnly cookie for web browser security
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    });

    // Also return the token and user data for frontend context
    res.status(201).json({ token, user: newUser });

  } catch (err) {
    console.error("Register Error:", err.message);
    if (err.message.includes('duplicate key value')) {
      return res.status(400).json({ msg: 'An account with this email already exists.' });
    }
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

/**
 * Logs in a customer.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM customer WHERE customer_email = $1', [email]);
    const user = rows[0];

    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.customer_password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });
    
    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000
    });
    
    // Return token and user data for frontend context
    res.json({ token, user });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

/**
 * --- NEW FUNCTION TO UPDATE USER PROFILE ---
 */
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const customerId = req.user.id; // From auth middleware

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    const existingUser = await pool.query(
      'SELECT customer_id FROM customer WHERE customer_email = $1 AND customer_id != $2',
      [email, customerId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'This email is already in use by another account.' });
    }

    const { rows } = await pool.query(
      'UPDATE customer SET customer_name = $1, customer_email = $2 WHERE customer_id = $3 RETURNING customer_id, customer_name, customer_email, customer_gender',
      [name, email, customerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user: rows[0] });

  } catch (err) {
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
};


/**
 * Logs out the customer by clearing the cookie.
 */
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ msg: 'Logged out successfully' });
};

/**
 * Gets the currently logged-in user's data.
 */
exports.getMe = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT customer_id, customer_name, customer_email, customer_gender FROM customer WHERE customer_id = $1', [req.user.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Get Me Error:", err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};
