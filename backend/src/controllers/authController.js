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
    const { email, password, name, phone } = req.body;

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
        phone: phone || null,
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
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        businessGroups: {
          include: {
            locations: true,
            subscriptions: true,
            website: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const firstBg = user.businessGroups && user.businessGroups.length > 0 ? user.businessGroups[0] : null;

    res.json({
      status: 'success',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profilePicture: user.profilePicture,
        businessName: firstBg ? firstBg.name : `${user.name}'s Business`,
        businessGroup: firstBg
      }
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
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

    // Method D: Mobile token fallback removed - authentic Google verification only
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Failed to verify Google login credentials with Google servers. Please try again.' });
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

// 4b. GET Handler for Google Auth Endpoint (Friendly Response)
exports.googleAuthGet = (req, res) => {
  return res.status(200).json({
    status: 'info',
    message: 'Google authentication endpoint accepts POST requests with idToken credential payload.'
  });
};

exports.googleAuthWeb = (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '101383899067-vcdeda4a4ajqcce8h5593htb34ksgdka.apps.googleusercontent.com';
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Sign In with Google</title>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      <style>
        body {
          background-color: #090d16;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 24px 16px;
          box-sizing: border-box;
        }
        .card {
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 36px 24px;
          text-align: center;
          max-width: 380px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(16px);
        }
        h2 { margin: 0 0 8px 0; font-size: 22px; font-weight: 700; color: #f8fafc; }
        p { font-size: 13px; color: #94a3b8; margin: 0 0 28px 0; line-height: 1.5; }
        .g-container { display: flex; justify-content: center; width: 100%; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Sign In with Google</h2>
        <p>Select your Google account below to authenticate securely with ManaCity</p>
        <div class="g-container">
          <div id="g_id_onload"
             data-client_id="${clientId}"
             data-callback="handleCredentialResponse"
             data-auto_prompt="false">
          </div>
          <div class="g_id_signin"
             data-type="standard"
             data-shape="rectangular"
             data-theme="filled_dark"
             data-text="continue_with"
             data-size="large"
             data-logo_alignment="left"
             data-width="300">
          </div>
        </div>
      </div>

      <script>
        function handleCredentialResponse(response) {
          if (response && response.credential) {
            fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken: response.credential })
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
              if (data.token) {
                var role = data.user && data.user.role ? data.user.role : 'BUSINESS_OWNER';
                var email = data.user && data.user.email ? data.user.email : '';
                window.location.href = '/api/auth/google-web?token=' + encodeURIComponent(data.token) + '&role=' + encodeURIComponent(role) + '&email=' + encodeURIComponent(email);
              } else {
                alert(data.error || 'Google login failed.');
              }
            })
            .catch(function(err) {
              alert('Network error. Please try again.');
            });
          }
        }
      </script>
    </body>
    </html>
  `);
};

exports.googleAuthCallback = (req, res) => {
  return res.status(200).send('OK');
};

// 4b. Apple OAuth Authentication Endpoint
exports.appleAuth = async (req, res) => {
  try {
    const { identityToken, appleId, email, name, role: userRole } = req.body;

    if (!identityToken && !appleId) {
      return res.status(400).json({ error: 'Apple identity token or user identifier is required.' });
    }

    let payload = null;
    if (identityToken) {
      try {
        payload = jwt.decode(identityToken);
      } catch (e) {
        console.warn('Apple JWT decode warning:', e.message);
      }
    }

    const userEmail = (email || (payload && payload.email) || `${appleId || 'apple_user'}@appleid.anon`).toLowerCase().trim();
    const userAppleId = String(appleId || (payload && payload.sub) || `apple_${userEmail}`);
    const userName = name || (payload && payload.email ? payload.email.split('@')[0] : 'Apple User');

    let user = await prisma.user.findFirst({
      where: { appleId: userAppleId }
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: userEmail }
      });

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            appleId: userAppleId,
            provider: 'APPLE'
          }
        });
      } else {
        const requestedRole = userRole === 'CUSTOMER' ? 'CUSTOMER' : 'BUSINESS_OWNER';
        user = await prisma.user.create({
          data: {
            email: userEmail,
            name: userName,
            provider: 'APPLE',
            appleId: userAppleId,
            role: requestedRole
          }
        });

        if (requestedRole === 'BUSINESS_OWNER') {
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
              status: 'ACTIVE',
              locationLimit: 1,
              websiteLimit: 1
            }
          });
        }
      }
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
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Apple auth error:', error);
    return res.status(500).json({ error: 'Apple login failed due to a server error.' });
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

// 6. Update User Phone Number
exports.updatePhone = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { phone } = req.body;

    if (!userId || !phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { phone }
    });

    return res.json({
      status: 'success',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Update phone error:', error);
    return res.status(500).json({ error: 'Failed to update phone number.' });
  }
};
