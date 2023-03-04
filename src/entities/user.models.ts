import { Scrub } from './scrubs.models';

export type User = {
  id: string;
  email: string;
  passwd: string;
  // Este campo es opcional, sirve para optimizar la búsqueda, pero dificulta la creación del programa
  // Será útil cuando la búsqueda de cosas de un usuario se haga a menudo
  scrubs: Scrub[];
};

/* Relaciones entre usuario y entidad:

      1 - n -> User => n cosas // Cosa => 1 usuario
      n - n -> User => n cosas // Cosa => n usuarios

*/

/* Se puede crear una tabla de relación - no es habitual en DB no SQL

UserThing = {
  userId
  thing id
}
*/
