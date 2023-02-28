import { ScrubsFileRepo } from './scrubs.file.repo.js';
import fs from 'fs/promises';

// Lo mockeamos así si lo necesitamos
jest.mock('fs/promises');
// Si queremos mockear de forma hasBeenCalled' hace falta importarlo normal también
describe('Given the ScrubsFileRepo', () => {
  const repo = new ScrubsFileRepo();

  describe('When instantiated', () => {
    test('Then it should be instance of class', () => {
      expect(repo).toBeInstanceOf(ScrubsFileRepo);
    });
  });

  describe('When I use read', () => {
    test('Then it should call the readFile function', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[{"name":"test"}]');

      const result = await repo.query();
      expect(fs.readFile).toHaveBeenCalled();
      expect(result).toEqual([{ name: 'test' }]);
    });
  });

  describe('When I use readOne', () => {
    test('Then it should return the argument if it has a valid id', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[{"id":2}]');

      const result = await repo.queryById('2');
      expect(fs.readFile).toHaveBeenCalled();
      expect(result).toEqual({ id: 2 });
    });
  });

  describe('When I use readOne', () => {
    test('Then it should throw an error if it has not a valid id', () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[{"name":"test"}]');

      expect(fs.readFile).toHaveBeenCalled();
      // Se puede hacer también de la manera que lo tengo en el archivo del repo de front
      expect(async () => {
        await repo.queryById('2');
      }).rejects.toThrow();
    });
  });
});
