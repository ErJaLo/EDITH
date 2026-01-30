export interface User {
  id: number;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
