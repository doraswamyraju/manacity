const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

// Generate standard JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

// 1. Email/Password Registration
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields (email, password, name) are required.' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'BUSINESS_OWNER'
      }
    });

    // Create default BusinessGroup for user
    const businessGroup = await prisma.businessGroup.create({
      data: {
        name: `${name}'s Businesses`,
        ownerId: user.id
      }
    });

    // Setup initial free subscription
    await prisma.subscription.create({
      data: {
        businessGroupId: businessGroup.id,
        tier: 'FREE',
        status: 'ACTIVE',
        locationLimit: 1,
        websiteLimit: 1
      }
    });

    const token = generateToken(user.id);

    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create user account.' });
  }
};

// 2. Email/Password Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid login credentials.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid login credentials.' });
    }

    const token = generateToken(user.id);

    res.json({
      status: 'success',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login process failed.' });
  }
};

// 3. Get Authenticated User Details (Token Verification)
exports.getMe = async (req, res) => {
  res.json({
    status: 'success',
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    }
  });
};

// 4. Mock / Unified Google Auth Integration
exports.googleAuth = async (req, res) => {
  try {
    const { tokenId, email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Google authentication details missing.' });
    }

    // Find or create the user matching Google email credentials
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // Create user with a dummy password hash
      const passwordHash = await bcrypt.hash(Math.random().toString(36).substring(2), 10);
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          passwordHash,
          role: 'BUSINESS_OWNER'
        }
      });

      // Create initial group and free tier subscription
      const businessGroup = await prisma.businessGroup.create({
        data: {
          name: `${user.name}'s Businesses`,
          ownerId: user.id
        }
      });

      await prisma.subscription.create({
        data: {
          businessGroupId: businessGroup.id,
          tier: 'FREE',
          status: 'ACTIVE'
        }
      });
    }

    const token = generateToken(user.id);

    res.json({
      status: 'success',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Google OAuth authentication failed.' });
  }
};
