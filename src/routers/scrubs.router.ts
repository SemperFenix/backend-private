import { Router as router } from 'express';
import { ScrubsController } from '../controllers/scrubs.controller.js';
import { authorized } from '../interceptors/authorized.js';
import { logged } from '../interceptors/logged.js';
import { ScrubsMongoRepo } from '../repository/scrubs.mongo.repo.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';

// Se puede añadir la inyección de dependencias en el repo del modelo.

export const scrubsRouter = router();
const repoScrubs = ScrubsMongoRepo.getInstance();
const repoUsers = UsersMongoRepo.getInstance();
const controller = new ScrubsController(repoScrubs, repoUsers);

scrubsRouter.get('/', logged, controller.getAll.bind(controller));
scrubsRouter.get('/:id', logged, controller.get.bind(controller));
scrubsRouter.post(
  '/',
  logged,

  controller.post.bind(controller)
);
scrubsRouter.patch(
  '/:id',
  logged,
  (req, res, next) => {
    authorized(req, res, next, repoScrubs);
  },

  controller.patch.bind(controller)
);
scrubsRouter.delete(
  '/:id',
  logged,
  (req, res, next) => {
    authorized(req, res, next, repoScrubs);
  },
  controller.delete.bind(controller)
);
