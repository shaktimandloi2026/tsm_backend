import { Request } from 'express';
import { UserRole } from './index';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    branchId?: string;
    companyId?: string;
  };
}
