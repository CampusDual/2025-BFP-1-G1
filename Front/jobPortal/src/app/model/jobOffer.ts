import { Company } from './company';

export enum EnumModalidadTrabajo {
  Presencial = 'Presencial',
  Remoto = 'Remoto',
  Hibrido = 'Hibrido'
}

export class JobOffer {
  id?: number;
  email!: string;
  company?: Company;
  title!: string;
  description!: string;
  releaseDate!: Date;
  localizacion!: string;
  modalidadTrabajo!: EnumModalidadTrabajo;
  requisitos!: string;
  deseables?: string;
  beneficios!: string;
}
