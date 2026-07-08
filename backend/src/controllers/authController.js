const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { OAuth2Client } = require('google-auth-library');
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


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

exports.googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Google authentication token (idToken) is required.' });
    }

    // Verify Google ID Token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: profilePicture, email_verified } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Google account is missing an email address.' });
    }

    if (!email_verified) {
      return res.status(400).json({ error: 'Google email address must be verified.' });
    }

    // Find user by googleId first or by email to link existing local accounts
    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      // Check if user already exists by email (linked account scenario)
      user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        // Link existing local account to Google provider
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            provider: 'GOOGLE',
            profilePicture: profilePicture || user.profilePicture
          }
        });
      } else {
        // Create new Google OAuth user (passwordHash is left undefined/null)
        user = await prisma.user.create({
          data: {
            email,
            name: name || email.split('@')[0],
            provider: 'GOOGLE',
            googleId,
            profilePicture,
            role: 'BUSINESS_OWNER'
          }
        });

        // Create default BusinessGroup for user
        const businessGroup = await prisma.businessGroup.create({
          data: {
            name: `${user.name}'s Businesses`,
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
      }
    } else {
      // Update profile picture and details if they changed in Google profile
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name || user.name,
          profilePicture: profilePicture || user.profilePicture
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
        role: user.role,
        provider: user.provider,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ error: 'Google OAuth authentication failed.' });
  }
};

// 5. Delete User Account and all cascaded data
exports.deleteAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid verification credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid verification credentials.' });
    }

    // Delete user (Prisma onDelete: Cascade rules will automatically delete associated businessGroups, locations, subscriptions, websites, reviews, etc.)
    await prisma.user.delete({ where: { id: user.id } });

    res.json({
      status: 'success',
      message: 'Your account and all associated business data have been permanently deleted.'
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ error: 'Failed to process account deletion.' });
  }
};
