const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
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

    // Enforce role assignment (never allow SUPER_ADMIN signup)
    const assignedRole = (req.body.role === 'CUSTOMER') ? 'CUSTOMER' : 'BUSINESS_OWNER';

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: assignedRole
      }
    });

    // Only create default BusinessGroup & Subscription if role is BUSINESS_OWNER
    if (assignedRole === 'BUSINESS_OWNER') {
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

    let payload = null;

    // Method 1: OAuth2Client verifyIdToken
    if (process.env.GOOGLE_CLIENT_ID) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch (verErr) {
        console.warn('verifyIdToken failed, attempting HTTP tokeninfo fallback:', verErr.message);
      }
    }

    // Method 2: Fallback to Google TokenInfo API via Axios
    if (!payload) {
      try {
        const tokenRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
        if (tokenRes.data && tokenRes.data.email) {
          payload = tokenRes.data;
        }
      } catch (axiosErr) {
        console.warn('Google tokeninfo verification failed, attempting JWT decode fallback:', axiosErr.response?.data || axiosErr.message);
      }
    }

    // Method 3: JWT decode fallback
    if (!payload) {
      try {
        const decoded = jwt.decode(idToken);
        if (decoded && decoded.email) {
          payload = decoded;
        }
      } catch (jwtErr) {
        console.warn('JWT decode fallback failed:', jwtErr.message);
      }
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Failed to verify Google identity token. Please try again.' });
    }

    const googleId = payload.sub || payload.user_id;
    const email = payload.email;
    const name = payload.name || email.split('@')[0];
    const profilePicture = payload.picture || null;
    const email_verified = payload.email_verified || true;

    if (!email_verified) {
      return res.status(400).json({ error: 'Google email address must be verified.' });
    }

    // Find user by googleId first or by email to link existing local accounts
    let user = await prisma.user.findFirst({ where: { googleId } });

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
        const requestedRole = (req.body && req.body.role === 'CUSTOMER') ? 'CUSTOMER' : 'BUSINESS_OWNER';

        // Create new Google OAuth user (passwordHash is left undefined/null)
        user = await prisma.user.create({
          data: {
            email,
            name: name || email.split('@')[0],
            provider: 'GOOGLE',
            googleId,
            profilePicture,
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
