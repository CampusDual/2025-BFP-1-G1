import { Company } from './company';

export enum EnumModalidadTrabajo {
  Presencial = 'presencial',
  Remoto = 'remoto',
  Hibrido = 'hibrido',
}

export class JobOffer {
  id?: number;
  email!: string;
  company?: Company;
  title!: string;
  description!: string;
  releaseDate!: Date;
  localizacion!: string;
  modalidad!: EnumModalidadTrabajo;
  requisitos!: string;
  deseables?: string;
  beneficios!: string;
  active!: boolean;
}
