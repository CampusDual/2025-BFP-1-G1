import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { JobOffer } from '../model/jobOffer';
import { Company } from '../model/company';

@Injectable({ providedIn: 'root' })
export class JobOfferService {
  private urlJobOffers = 'http://localhost:30030/jobOffers';
  private urlOffersManagement = 'http://localhost:30030/offersManagement';
  private urlProfileOffers = 'http://localhost:30030/profileOffers';
  company: Company | null = null;
  constructor(private http: HttpClient) {}

  getJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.urlJobOffers}/getAll`);
  }

  addJobOffers(jobOffer: JobOffer): Observable<JobOffer> {
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post<JobOffer>(this.urlOffersManagement.concat('/add'), jobOffer, {
        headers: httpHeaders,
      })
      .pipe(
        map((response) => {
          let jobOffer = response as JobOffer;
          return jobOffer;
        }),
        catchError((e) => {
          console.error(e.error.status + ':' + e.error.error);
          return throwError(() => e);
        })
      );
  }

  getProfileOffers(): Observable<JobOffer[]> {
    console.log('Llamando a getProfileOffers()');
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(
        () =>
          new Error(
            'No se encontró el token de autenticación. Por favor, inicia sesión.'
          )
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log('URL:', this.urlProfileOffers);
    return this.http.get<JobOffer[]>(this.urlProfileOffers.concat('/getAll'), {
      headers,
    });
  }
}
