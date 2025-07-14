import { User } from './user';

export class Company {
  id?: number;
  cif!: string;
  name!: string;
  phone!: string;
  address!: string;
  user!: User;
  web!: string;
}
