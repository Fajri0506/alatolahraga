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

// Debug: ping endpoint (no DB)
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'OK', path: req.path, originalUrl: req.originalUrl });
});

// Debug: health check with DB test
app.get('/health', async (req, res) => {
  try {
    const db = require('./config/database');
    const [rows] = await db.query('SELECT NOW() as time');
    res.status(200).json({ status: 'OK', db: 'connected', time: rows[0]?.time });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// Create a router for all API routes
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/kategori', kategoriRoutes);
apiRouter.use('/alat', alatRoutes);
apiRouter.use('/penyewaan', penyewaanRoutes);
apiRouter.use('/pengembalian', pengembalianRoutes);
apiRouter.use('/pembayaran', pembayaranRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

// API Routes mounting (Local & Netlify)
app.use('/api', apiRouter);
app.use('/.netlify/functions/api', apiRouter);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
