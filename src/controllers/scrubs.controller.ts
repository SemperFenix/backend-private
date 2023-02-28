import { NextFunction, Request, Response } from 'express';
import { Scrub } from '../entities/scrubs.models.js';
import { Repo } from '../repository/repo.interface.js';
import createDebug from 'debug';

const debug = createDebug('W6B:controller');

export class ScrubsController {
  // eslint-disable-next-line no-useless-constructor, no-unused-vars
  constructor(public repo: Repo<Scrub>) {
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

  async post(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('Post trying...');

      console.log(req.body);
      const data = await this.repo.create(req.body);
      // Cuando usamos then, la respuesta tiene que estar dentro del then
      resp.json({ results: [data] });
      // Los métodos sólo deben devolver resp.json porque se lo estamos devolviendo a fetch, no al usuario
    } catch (error) {
      debug('Error posting');

      next(error);
    }
  }

  // Los métodos update y delete están hechos con async para utilizar ambas formas de resolver promesas

  async patch(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('Patch trying...');

      req.body.id = req.params.id ? req.params.id : req.body.id;
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
