import { NextFunction, Request, Response } from 'express';
import { Scrub } from '../entities/scrubs.models.js';
import { Repo } from '../repository/repo.interface.js';
import createDebug from 'debug';
import { HTTPError } from '../errors/errors.js';
import { CustomRequest } from '../interceptors/logged.js';
import { User } from '../entities/user.models.js';

const debug = createDebug('W6B:ScrubsController');

export class ScrubsController {
  // eslint-disable-next-line no-useless-constructor, no-unused-vars
  constructor(public repo: Repo<Scrub>, public repoUsers: Repo<User>) {
    debug('instantiated');
  }

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    // El estándar dice que las API deben devolver un objeto con una propiedad que contenta los resultados, no los resultados directamente.
    try {
      debug('GetAll trying...');
      const data = await this.repo.query();
      resp.json({ results: data });
    } catch (error) {
      // Si next recibe **cualquier** parámetro, llama al middleware de errores
      next(error);
    }
  }

  async get(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('GetById trying...');

      const data = await this.repo.queryById(req.params.id);

      if (data === undefined) resp.json({ results: [] });
      resp.json({ results: [data] });
    } catch (error) {
      debug('Error getting ID');
      next(error);
    }
  }

  async post(req: CustomRequest, resp: Response, next: NextFunction) {
    try {
      debug('Post trying...');
      const userId = req.info?.id;
      if (!userId) throw new HTTPError(404, 'Not found', 'No user id');
      const actualUser = await this.repoUsers.queryById(userId); // Repo throws error if not found

      req.body.owner = userId;
      const newScrub = await this.repo.create(req.body);

      // Opción para la relación bidireccional
      actualUser.scrubs.push(newScrub);
      await this.repoUsers.update(actualUser);
      // Cuando usamos then, la respuesta tiene que estar dentro del then
      resp.json({ results: [newScrub] });
      // Los métodos sólo deben devolver resp.json porque se lo estamos devolviendo a fetch, no al usuario
    } catch (error) {
      debug('Error posting');

      next(error);
    }
  }

  // Los métodos update y delete están hechos con async para utilizar ambas formas de resolver promesas

  async patch(req: CustomRequest, resp: Response, next: NextFunction) {
    try {
      debug('Patch trying...');

      const data = await this.repo.update(req.body);
      // Los métodos sólo deben devolver resp.json porque se lo estamos devolviendo a fetch, no al usuario
      resp.json({ results: [data] });
    } catch (error) {
      debug('Error patching');

      next(error);
    }
  }

  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('Delete trying...');

      await this.repo.destroy(req.params.id);
      // Los métodos sólo deben devolver resp.json porque se lo estamos devolviendo a fetch, no al usuario
      // Resp.json devuelve el status 200 de forma predeterminada, además de lo que enviemos
      resp.json({ results: [] });
    } catch (error) {
      debug('Error deleting');

      next(error);
    }
  }
}
