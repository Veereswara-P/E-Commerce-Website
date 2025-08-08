const pool = require('../config/db');

exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ msg: 'Please provide a name and email' });
  }
  try {
    const { rows } = await pool.query(
      'UPDATE customer SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Customer not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
