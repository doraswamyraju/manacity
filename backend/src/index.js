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
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const taskRoutes = require('./routes/taskRoutes');
const websiteRoutes = require('./routes/websiteRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const crmRoutes = require('./routes/crmRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewSystemRoutes = require('./routes/reviewSystemRoutes');
const phase1Routes = require('./routes/phase1Routes');
const referralRoutes = require('./routes/referralRoutes');

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


const systemSettingsController = require('./controllers/systemSettingsController');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/website', websiteRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/reviews', reviewSystemRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/lead', crmRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/phase1', phase1Routes);
app.use('/api/referrals', referralRoutes);

// Public System Settings
app.get('/api/public/url-settings', systemSettingsController.getUrlSettings);



// Sample Test Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'ManaCity API Service is active.',
    port: PORT,
    database: 'MongoDB (Prisma)'
  });
});

// Database Connection & Server Start (Resilient & Non-Blocking)
app.listen(PORT, () => {
  console.log(`ManaCity API Server is running cleanly on port ${PORT}`);
  
  prisma.$connect()
    .then(() => {
      console.log('Successfully connected to MongoDB via Prisma Client.');
    })
    .catch((error) => {
      console.error('Prisma MongoDB connection warning (retrying in background):', error.message);
    });
});

