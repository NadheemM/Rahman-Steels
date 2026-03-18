const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const steelPriceRoutes = require('./routes/steelPrices');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

connectDB();

const app = express();

// Initialize chron jobs
require('./jobs/updatePrices');

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// APIs
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/steel-prices', steelPriceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
