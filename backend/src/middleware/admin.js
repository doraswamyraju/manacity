const admin = (req, res, next) => {
  if (req.user && req.user.role === 'SUPER_ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Super Admin privileges required.' });
  }
};

module.exports = admin;
