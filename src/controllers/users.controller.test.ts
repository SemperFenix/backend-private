import { Request, Response } from 'express';
import { UsersMongoRepo } from '../repository/users.mongo.repo';
import { Auth } from '../services/auth';
import { UsersController } from './users.controller';

jest.mock('../services/auth.js');

describe('Given the scrubsController', () => {
  const mockRepo: UsersMongoRepo = {
    query: jest.fn(),
    queryById: jest.fn(),
    search: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  };

  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();
  const controller = new UsersController(mockRepo);

  // Tests:
  // When there are not passwd in the body
  // Then -> .toThrow()

  describe('When register is called', () => {
    test('Then it should return the created user', async () => {
      const req = {
        body: {
          email: 'Test',
          password: 'testp',
        },
      } as unknown as Request;
      await controller.register(req, resp, next);
      expect(Auth.hash).toHaveBeenCalled();
      expect(mockRepo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When register is called without email or password', () => {
    test('Then it should throw an error', async () => {
      const req = {
        body: {},
      } as unknown as Request;
      await controller.register(req, resp, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('When login is called ', () => {
    test('Then it should call resp.json', async () => {
      const req = {
        body: {
          email: 'Test',
          password: 'testp',
        },
      } as unknown as Request;
      await controller.login(req, resp, next);
      (mockRepo.search as jest.Mock).mockResolvedValue([{ email: 'test' }]);
      expect(Auth.compare).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  // Describe('When getById returns an error', () => {
  //   test('Then it should call next', async () => {
  //     (mockRepo.queryById as jest.Mock).mockRejectedValue(new Error(''));
  //     await controller.getById(req, resp, next);
  //     expect(next).toHaveBeenCalled();
  //   });
  // });

  // describe('When post is called and return data', () => {
  //   test('Then it should call resp.json', async () => {
  //     await controller.post(req, resp, next);
  //     expect(mockRepo.create).toHaveBeenCalled();
  //     expect(resp.json).toHaveBeenCalled();
  //   });
  // });

  // describe('When post is called and return error', () => {
  //   test('Then it should call resp.json', async () => {
  //     (mockRepo.create as jest.Mock).mockRejectedValue(new Error(''));
  //     await controller.post(req, resp, next);
  //     expect(next).toHaveBeenCalled();
  //   });
  // });

  // describe('When patch is called and return data', () => {
  //   test('Then it should call resp.json', async () => {
  //     await controller.patch(req, resp, next);
  //     expect(mockRepo.update).toHaveBeenCalled();
  //     expect(resp.json).toHaveBeenCalled();
  //   });
  // });
});
