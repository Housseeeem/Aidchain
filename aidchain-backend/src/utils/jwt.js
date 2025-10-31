const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
