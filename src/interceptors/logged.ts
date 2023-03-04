import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/errors.js';
import { Auth, TokenPayload } from '../services/auth.js';

export interface CustomRequest extends Request {
  info?: TokenPayload;
}

export function logged(req: CustomRequest, res: Response, next: NextFunction) {
  // Req.get permite coger un header
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader)
      throw new HTTPError(
        498,
        'Token expired/invalid',
        'No authorization header found'
      );
    if (!authHeader.startsWith('Bearer'))
      throw new HTTPError(
        498,
        'Token expired/invalid',
        'No Bearer in auth header'
      );

    // Bearer siempre va a ser constante, slice coge la siguiente posición a la indicada
    const token = authHeader.slice(7);
    const payload = Auth.getTokenPayload(token);
    req.info = payload;
    next();
  } catch (error) {
    next(error);
  }
}
