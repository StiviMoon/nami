import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors';

export function requireSuperAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    return next(new ForbiddenError('Acceso restringido a super admins'));
  }
  next();
}
