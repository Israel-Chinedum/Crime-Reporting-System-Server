import type { jwtPayload } from '../jwt-payload';

declare global {
  namespace Express {
    interface Request {
      user?: jwtPayload;
    }
  }
}

export {};
