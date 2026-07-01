const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5009;

// Routes
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);

// Sample Test Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'ManaCity API Service is active.',
    port: PORT,
    database: 'MongoDB (Prisma)'
  });
});

// Database Connection & Server Start
async function startServer() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to MongoDB via Prisma Client.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
