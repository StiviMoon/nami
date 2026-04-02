import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

export function requireApproved(req: Request, _res: Response, next: NextFunction) {
  const status = req.user?.restaurantStatus;
  if (!status || status !== 'ACTIVE') {
    return next(new ApiError(403, 'RESTAURANT_NOT_APPROVED'));
  }
  next();
}
