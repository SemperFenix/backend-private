import { NextFunction, Request, Response } from 'express';
import { Repo } from '../repository/repo.interface.js';
import createDebug from 'debug';
import { User } from '../entities/user.models.js';
import { HTTPError } from '../errors/errors.js';
import { Auth, TokenPayload } from '../services/auth.js';

const debug = createDebug('W6B:Usercontroller');

export class UsersController {
  // eslint-disable-next-line no-unused-vars
  constructor(public repo: Repo<User>) {
    debug('Instantiated');
  }

  async getAll(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('GetAll trying...');
      const data = await this.repo.query();
      resp.json({ results: data });
    } catch (error) {
      // Si next recibe **cualquier** parámetro, llama al middleware de errores
      next(error);
    }
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('Registration in process...');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid email or passwd');
      req.body.passwd = await Auth.hash(req.body.passwd);
      req.body.scrubs = [];
      const data = await this.repo.create(req.body);
      resp.status(201);
      resp.json({ results: [data] });
    } catch (error) {
      debug('Error posting');

      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('GetById trying...');

      // Llegan datos del usuario en el req.body
      // Search by Email en la BBDD
      // Si lo tengo -> Crear el token
      // Send el token
      // Si no lo tengo
      // Send error

      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid email');

      const data = await this.repo.search([
        {
          key: 'email',
          value: req.body.email,
        },
      ]);
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');

      if (!(await Auth.compare(req.body.passwd, data[0].passwd)))
        throw new HTTPError(401, 'Unauthorized', 'Not matching password');
      const payload: TokenPayload = {
        id: data[0].id,
        email: data[0].email,
        role: 'admin',
      };

      const token = Auth.createJWT(payload);

      return resp.json({ results: { token } });
    } catch (error) {
      debug('Error getting ID');
      next(error);
    }
  }
}
