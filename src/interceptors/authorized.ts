import { NextFunction, Response } from 'express';
import { HTTPError } from '../errors/errors.js';
import { ScrubsMongoRepo } from '../repository/scrubs.mongo.repo.js';
import { Auth, TokenPayload } from '../services/auth.js';
import { CustomRequest } from './logged.js';
import createDebug from 'debug';

const debug = createDebug('W6B:Authorized');

export async function authorized(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  repo: ScrubsMongoRepo // Haciendo esto, hacemos una inyección de dependencias, manteniendo el patrón singleton
) {
  try {
    debug('Called');

    if (!req.info)
      throw new HTTPError(498, 'Token not found', 'No info in the request');

    const userId = req.info.id;

    if (!req.body.id) req.body.id = req.params.id;

    const thingId = req.body.id;

    const thing = await repo.queryById(thingId);
    debug(thing.owner.id);
    debugger;
    if (thing.owner.id !== userId) {
      throw new HTTPError(401, 'Not authorized', 'Not authorized');
    }
    debug('Authorized! =)');
    next();

    // Tengo el id de usuario (req.info)

    // Tengo el id de la cosa( req.params.id)

    // Busco la cosa
    // Comparo cosa.owner.id con req.info.id
  } catch (error) {
    next(error);
  }
}
