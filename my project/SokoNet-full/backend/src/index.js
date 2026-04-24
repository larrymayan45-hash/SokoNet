/**
 * SokoNet Backend Server
 * Main entry point for the Node.js/Express API server
 * Features: REST API, WebSocket real-time updates, authentication
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/jobs');
const bidRoutes = require('./routes/bids');
const paymentRoutes = require('./routes/payments');
const ratingRoutes = require('./routes/ratings');
const escrowRoutes = require('./routes/escrow');
const ussdRoutes = require('./routes/ussd');
const locationRoutes = require('./routes/location');
const skillsRoutes = require('./routes/skills');
const trustCirclesRoutes = require('./routes/trustCircles');
const franchisesRoutes = require('./routes/franchises');
const dashboardRoutes = require('./routes/dashboard');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import services
const socketHandlers = require('./workers/socketHandlers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/ussd', ussdRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/trust-circles', trustCirclesRoutes);
app.use('/api/franchises', franchisesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use(errorHandler);

// Socket.io setup
socketHandlers(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };