import { User } from './user';

export class Candidate {
  id?: number;
  name!: string;
  surname!: string;
  phone!: string;
  user!: User;
  birthdate!: Date;
}
