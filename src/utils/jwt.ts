import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../types';

interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  branchId?: string;
  companyId?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
};
