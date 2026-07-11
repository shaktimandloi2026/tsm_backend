import { Response, NextFunction } from 'express';
import { UserRole } from '../types';
import { AuthRequest } from '../types/express';
import { sendError } from '../utils/response';

const roleHierarchy: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 6,
  [UserRole.ADMIN]: 5,
  [UserRole.BRANCH_MANAGER]: 4,
  [UserRole.ACCOUNTANT]: 3,
  [UserRole.BOOKING_OPERATOR]: 2,
  [UserRole.DRIVER]: 1,
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      sendError(res, 'Insufficient permissions', 403);
      return;
    }

    next();
  };
};

export const authorizeMinRole = (minRole: UserRole) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    if (roleHierarchy[req.user.role] < roleHierarchy[minRole]) {
      sendError(res, 'Insufficient permissions', 403);
      return;
    }

    next();
  };
};
