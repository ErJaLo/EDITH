import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Response, NextFunction } from 'express';
import { AuthRequest, JwtPayload } from '../types/auth';
import { pool } from '../config/db';

/**
 * Middleware para verificar JWT token en requests
 */
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Generar JWT token
 */
export const generateToken = (id: number, email: string): string => {
  const secret = process.env.JWT_SECRET as string;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign(
    { id, email },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
  );
};

/**
 * Hashear password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

/**
 * Verificar password
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Obtener usuario por email
 */
export const getUserByEmail = async (email: string) => {
  const result = await pool.query(
    'SELECT id, email, password FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

/**
 * Crear nuevo usuario
 */
export const createUser = async (email: string, password: string) => {
  const hashedPassword = await hashPassword(password);
  const result = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
    [email, hashedPassword]
  );
  return result.rows[0];
};
