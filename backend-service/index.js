require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

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
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: ['https://frontend-service-721810542467.asia-south2.run.app', 'http://localhost:5173', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());

// --- SWAGGER API DOCS ROUTE ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/wishlist', auth, wishlistRoutes);
app.use('/api/cart', auth, cartRoutes);
app.use('/api/search', searchRoutes); 

app.get('/', (req, res) => res.send('Backend service running'));

// --- UPGRADED CENTRALIZED ERROR HANDLER ---
app.use((err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  console.error('ERROR 💥', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong on the server!'
  });
});


app.listen(PORT, () => {
  console.log(`✅ Backend service running on port ${PORT}`);
});