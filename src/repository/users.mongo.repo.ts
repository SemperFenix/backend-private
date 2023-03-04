import { User } from '../entities/user.models.js';
import { HTTPError } from '../errors/errors.js';
import { Repo } from './repo.interface.js';
import { UserModel } from './users.mongo.model.js';
import createDebug from 'debug';

const debug = createDebug('W6B:userMongoRepo');

export class UsersMongoRepo implements Repo<User> {
  // Añadimos el patrón de dependencias singleton declarando la propiedad static privada y convirtiend el constructor en privado

  private static instance: UsersMongoRepo;
  private constructor() {
    debug('Instantiate');
  }

  public static getInstance(): UsersMongoRepo {
    if (!UsersMongoRepo.instance) {
      UsersMongoRepo.instance = new UsersMongoRepo();
    }
    return UsersMongoRepo.instance;
  }

  async query(): Promise<User[]> {
    // Este método lo dejamos para así mantener el interfaz repo, pero no lo necesitamos
    debug('Query');
    const data = await UserModel.find().populate('scrubs');
    return data;
  }

  async queryById(id: string): Promise<User> {
    debug('QueryID');
    const data = await UserModel.findById(id);
    if (!data)
      throw new HTTPError(404, 'Not found', 'User Id not found in queryId');
    return data;
  }

  // Añadimos el método search
  // Las querys son PseudoPromesas, aunque tengan el método then, podemos utilizar .exec() para que se conviertan en promesas
  // En este momento no nos afecta para

  async search(query: { key: string; value: unknown }[]): Promise<User[]> {
    debug('Searching...');
    const preQuery = query.map((item) => ({ [item.key]: item.value }));

    const myQuery = preQuery.reduce((obj, item) => ({ ...obj, ...item }));
    const data = await UserModel.find({ ...myQuery });
    return data;
  }

  async create(info: Partial<User>): Promise<User> {
    debug('Create');
    const data = await UserModel.create(info);

    return data;
  }

  async update(info: User): Promise<User> {
    debug('Update');
    // El método findByIdAndUpdate devuelve por defecto los datos anteriores, por eso le añadimos el modificador
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in update');

    return data;
  }

  async destroy(info: string): Promise<void> {
    debug('Destroy');
    const data = UserModel.findByIdAndDelete(info);
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: id not found'
      );
  }
}
