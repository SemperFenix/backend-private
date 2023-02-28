import { Request, Response } from 'express';
import { ScrubsFileRepo } from '../repository/scrubs.file.repo';
import { ScrubsController } from './scrubs.controller';

describe('Given the scrubsController', () => {
  const mockRepo: ScrubsFileRepo = {
    query: jest.fn(),
    queryById: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  };
  const req = {
    body: {},
    params: {
      id: '3',
    },
  } as unknown as Request;

  const resp = {
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();
  const controller = new ScrubsController(mockRepo);

  describe('When getAll is used', () => {
    test('Then it should return the response', async () => {
      await controller.getAll(req, resp, next);
      expect(mockRepo.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When getAll returns an error', () => {
    test('Then it should call the next middleware', async () => {
      (mockRepo.query as jest.Mock).mockRejectedValue(new Error(''));
      await controller.getAll(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
