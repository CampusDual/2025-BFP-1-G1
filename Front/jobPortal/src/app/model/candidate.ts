import { User } from './user';

export class Candidate {
  id?: number;
  name!: string;
  surname!: string;
  phone!: string;
  user!: User;
  birthdate?: Date;
  profileImg?: string;
  location?: string;
  qualification?: string;
  experience?: string;
  employmentStatus?: string;
  availability?: string;
  modality?: string;
  aboutMe?: string;
  linkedin?: string;
  github?: string;
  web?: string;
}
