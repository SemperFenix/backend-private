export interface Repo<T> {
  // Excepto delete, lo más correcto es que los métodos devuelvan algo (salvo delete)
  // Read normalmente se llama query
  query(): Promise<T[]>;
  queryById(_id: string): Promise<T>;
  create(_info: Partial<T>): Promise<T>;
  update(_info: T): Promise<T>;
  // Delete puede llamarse erase o destroy
  destroy(_id: string): Promise<void>;
}

// En readOne y delete habr'ia que utilizar el T['id'], pero alarga el proceso y lo hacemos así de momento.
// En las bases de datos el ID será un string, lo dejo así para no modificar mi backend entero.
