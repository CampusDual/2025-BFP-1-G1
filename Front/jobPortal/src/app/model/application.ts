export interface Application {
  id: number;
  idCandidate: number;
  offerId: number;
  inscriptionDate?: string;
  status?: string;
  offer?: {
    id: number;
    title: string;
    company?: {
      name: string;
    };
  };
  candidateDetails?: {
    id: number;
    name: string;
    surname: string;
    phone?: string;
    birthdate?: string;
    user?: {
      id: number;
      email: string;
    };
  };
}
