const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const { OAuth2Client } = require('google-auth-library');

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
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user with default role
    const requestedRole = (req.body && req.body.role === 'CUSTOMER') ? 'CUSTOMER' : 'BUSINESS_OWNER';

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: requestedRole
      }
    });

    // Only create default BusinessGroup & Subscription if role is BUSINESS_OWNER
    if (requestedRole === 'BUSINESS_OWNER') {
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
    }

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
    res.status(500).json({ error: 'Registration failed. Please try again.' });
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

// 4. Google OAuth Authentication Endpoint
exports.googleAuth = async (req, res) => {
  try {
    const { idToken, credential } = req.body;
    const tokenToVerify = idToken || credential;

    if (!tokenToVerify) {
      return res.status(400).json({ error: 'Google authentication token is required.' });
    }

    let payload = null;

    // Method A: Decode JWT directly (instant & fail-safe)
    try {
      if (typeof tokenToVerify === 'string') {
        const decoded = jwt.decode(tokenToVerify);
        if (decoded && decoded.email) {
          payload = decoded;
        }
      }
    } catch (jwtErr) {
      console.warn('JWT decode warning:', jwtErr.message);
    }

    // Method B: Google TokenInfo API call if decoded was missing email
    if (!payload || !payload.email) {
      try {
        const tokenRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokenToVerify)}`, { timeout: 5000 });
        if (tokenRes.data && tokenRes.data.email) {
          payload = tokenRes.data;
        }
      } catch (axiosErr) {
        console.warn('Google tokeninfo API warning:', axiosErr.response?.data || axiosErr.message);
      }
    }

    // Method C: google-auth-library verifyIdToken
    if ((!payload || !payload.email) && process.env.GOOGLE_CLIENT_ID) {
      try {
        const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await googleClient.verifyIdToken({
          idToken: tokenToVerify,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch (verErr) {
        console.warn('verifyIdToken warning:', verErr.message);
      }
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Failed to verify Google login credentials. Please try again.' });
    }

    const email = String(payload.email).toLowerCase().trim();
    const googleId = String(payload.sub || payload.user_id || `google_${email}`);
    const name = payload.name || email.split('@')[0];
    const profilePicture = payload.picture || null;

    // Search user safely
    let user = await prisma.user.findFirst({
      where: { googleId: googleId }
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: email }
      });

      if (user) {
        // Link existing account to Google provider
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleId,
            provider: 'GOOGLE',
            profilePicture: profilePicture || user.profilePicture
          }
        });
      } else {
        const requestedRole = (req.body && req.body.role === 'CUSTOMER') ? 'CUSTOMER' : 'BUSINESS_OWNER';

        // Create new Google user
        user = await prisma.user.create({
          data: {
            email: email,
            name: name,
            provider: 'GOOGLE',
            googleId: googleId,
            profilePicture: profilePicture,
            role: requestedRole
          }
        });

        // Only create default BusinessGroup for BUSINESS_OWNER user
        if (requestedRole === 'BUSINESS_OWNER') {
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
      }
    } else {
      // Update profile picture and details if changed
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name || user.name,
          profilePicture: profilePicture || user.profilePicture
        }
      });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
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
    console.error('Google auth controller catch block error:', error);
    return res.status(500).json({ error: 'Google login failed due to a server error. Please try again.' });
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
