import { Company } from './company';

export class JobOffer {
  id?: number;
  email!: string;
  company!: Company;
  title!: string;
  description!: string;
  releaseDate!: Date;
}
