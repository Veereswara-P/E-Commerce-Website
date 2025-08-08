// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 

const auth = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
const PORT = process.env.PORT;

// Use cookie-parser middleware
app.use(cookieParser());

// Update CORS to allow credentials
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/wishlist', auth, wishlistRoutes);
app.use('/api/cart', auth, cartRoutes);
app.use('/api/search', searchRoutes); 

app.get('/', (req, res) => res.send('Backend service running'));

app.listen(PORT, () => {
  console.log(`✅ Backend service running on port ${PORT}`);
});
