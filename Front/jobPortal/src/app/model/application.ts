export interface Application {
  id: number;
  idCandidate: number;
  offerId: number;
  applicationDate?: string;
  status?: string;
  // Add any other fields that might be returned by the API
  offer?: {
    id: number;
    title: string;
    company?: {
      name: string;
    };
    // Add other offer fields as needed
  };
}