import { Router as router } from 'express';
import { ScrubsController } from '../controllers/scrubs.controller.js';
import { ScrubsMongoRepo } from '../repository/scrubs.mongo.repo.js';

export const scrubsRouter = router();
export const repo = new ScrubsMongoRepo();
const controller = new ScrubsController(repo);

scrubsRouter.get('/', controller.getAll.bind(controller));
scrubsRouter.get('/:id', controller.get.bind(controller));
scrubsRouter.post('/', controller.post.bind(controller));
scrubsRouter.patch('/:id', controller.patch.bind(controller));
scrubsRouter.delete('/:id', controller.delete.bind(controller));
