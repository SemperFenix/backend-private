import { Scrub } from '../entities/scrubs.models.js';
import { HTTPError } from '../errors/errors.js';
import { Repo } from './repo.interface.js';
import { ScrubModel } from './scrubs.mongo.model.js';
import createDebug from 'debug';

const debug = createDebug('W6B:scrubsMongoRepo');

export class ScrubsMongoRepo implements Repo<Scrub> {
  private static instance: ScrubsMongoRepo;

  private constructor() {
    debug('Instantiated...');
  }

  public static getInstance(): ScrubsMongoRepo {
    if (!ScrubsMongoRepo.instance) {
      ScrubsMongoRepo.instance = new ScrubsMongoRepo();
    }
    return ScrubsMongoRepo.instance;
  }

  async query(): Promise<Scrub[]> {
    debug('Query');
    const data = await ScrubModel.find().populate('owner');
    return data;
  }

  async queryById(id: string): Promise<Scrub> {
    debug('QueryID');
    const data = await ScrubModel.findById(id).populate('owner').exec();
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in queryId');
    return data;
  }

  async search(query: { key: string; value: unknown }[]) {
    debug('Searching...');

    const preQuery = query.map((item) => ({ [item.key]: item.value }));

    const myQuery = preQuery.reduce((obj, item) => ({ ...obj, ...item }));
    const data = await ScrubModel.find({ ...myQuery });
    return data;
  }

  async create(info: Partial<Scrub>): Promise<Scrub> {
    debug('Create');
    const data = await ScrubModel.create(info);

    return data;
  }

  async update(info: Scrub): Promise<Scrub> {
    // El método findByIdAndUpdate devuelve por defecto los datos anteriores, por eso le añadimos el modificador
    const data = await ScrubModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in update');
    debug('Updated! =)');

    return data;
  }

  async destroy(info: string): Promise<void> {
    debug('Destroy');
    const data = await ScrubModel.findByIdAndDelete(info);
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: id not found'
      );
  }
}
