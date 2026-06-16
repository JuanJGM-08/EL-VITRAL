const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function sanitizeString(value) {
  const text = String(value ?? '').trim();
  return text.replace(/[\x00-\x1F\x7F]/g, '');
}

function sanitizeEmail(value) {
  const email = sanitizeString(value).toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Email inválido');
  }
  return email;
}

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.split('=');
    cookies[name?.trim()] = rest.join('=').trim();
  });

  return cookies;
}

function getUserFromRequest(req) {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    const cookies = parseCookies(req.headers.cookie || '');
    token = cookies.token;
  }

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

function isAdmin(user) {
  return Boolean(user && user.rol === 'admin');
}

module.exports = {
  hashPassword,
  comparePassword,
  sanitizeString,
  sanitizeEmail,
  generateToken,
  verifyToken,
  getUserFromRequest,
  isAdmin,
  parseCookies,
};
