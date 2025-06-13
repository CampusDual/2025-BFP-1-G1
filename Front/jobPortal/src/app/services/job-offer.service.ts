import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobOffer } from '../model/jobOffer';

@Injectable({ providedIn: 'root' })
export class JobOfferService {
  private urlJobOffers = 'http://localhost:30030/jobOffers'; 

  constructor(private http: HttpClient) {}

  getJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.urlJobOffers}/getAll`);
  }
}