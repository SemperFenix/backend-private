import { User } from './user.models';

export type Scrub = {
  id: string;
  img: string;
  name: string;
  occupattion: string;
  personality: string;
  extendPerso: string;
  owner: User;
};

//Esto es relación 1-n
// Si la relacion fuera n-n
// owner: User[]
