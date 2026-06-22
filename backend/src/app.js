const express = require('express');
const cors = require('cors');
const path = require('path');
const errorMiddleware = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const alatRoutes = require('./routes/alatRoutes');
const penyewaanRoutes = require('./routes/penyewaanRoutes');
const pengembalianRoutes = require('./routes/pengembalianRoutes');
const pembayaranRoutes = require('./routes/pembayaranRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Sports Equipment Rental API',
    status: 'Running'
  });
});

// API Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/alat', alatRoutes);
app.use('/api/penyewaan', penyewaanRoutes);
app.use('/api/pengembalian', pengembalianRoutes);
app.use('/api/pembayaran', pembayaranRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
