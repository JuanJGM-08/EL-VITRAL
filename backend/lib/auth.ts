import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const sanitizeString = (value: unknown) => {
  const text = String(value ?? '').trim();
  return text.replace(/[\x00-\x1F\x7F]/g, '');
};

export const sanitizeEmail = (value: unknown) => {
  const email = sanitizeString(value).toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Email inválido');
  }
  return email;
};

export const generateToken = (payload: any) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

export const getUserFromRequest = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  let token: string | undefined;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get('token')?.value;
  }

  if (!token) return null;
  return verifyToken(token);
};

export const isAdmin = (user: any) => {
  return user && user.rol === 'admin';
};