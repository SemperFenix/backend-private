import { Router as router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { logged } from '../interceptors/logged.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';

// Se puede añadir la inyección de dependencias en el repo del modelo.

export const usersRouter = router();

export const repo = UsersMongoRepo.getInstance();
const controller = new UsersController(repo);

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.get('/', logged, controller.getAll.bind(controller));
