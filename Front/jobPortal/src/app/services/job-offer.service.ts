import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { JobOffer } from '../model/jobOffer';
import { Company } from '../model/company';

@Injectable({ providedIn: 'root' })
export class JobOfferService {
  private urlJobOffers = 'http://localhost:30030/jobOffers';
  private urlOffersManagement = 'http://localhost:30030/offersManagement';
  private urlProfileOffers = 'http://localhost:30030/profileOffers';
  company: Company | null = null;

  private offersChangedSubject = new Subject<void>();

  constructor(private http: HttpClient) {}
  getOffersChangedObservable(): Observable<void> {
    return this.offersChangedSubject.asObservable();
  }

  getJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.urlJobOffers}/getAll`);
  }

  getJobOfferSorted(sortBy: string, direction: string): Observable<JobOffer[]> {
    let params = new HttpParams()
      .set('sortBy', sortBy)
      .set('direction', direction);
    return this.http.get<JobOffer[]>(this.urlJobOffers.concat('/sort'), {
      params,
    });
  }

  getJobOffersFiltered(filterBy: string): Observable<JobOffer[]> {
    let params = new HttpParams().set('filterBy', filterBy);
    return this.http.get<JobOffer[]>(this.urlJobOffers.concat('/filter'), {
      params,
    });
  }

  getJobOffersByCompanyFiltered(filterBy: string): Observable<JobOffer[]> {
    const params = new HttpParams().set('filterBy', filterBy);
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
    return this.http.get<JobOffer[]>(
      this.urlProfileOffers.concat('/getAllFilter'),
      { headers, params }
    );
  }

  getJobOffersByCompanySorted(
    sortBy: string,
    direction: string
  ): Observable<JobOffer[]> {
    const params = new HttpParams()
      .set('sortBy', sortBy)
      .set('direction', direction);
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

    return this.http.get<JobOffer[]>(
      this.urlProfileOffers.concat('/getAllSorted'),
      {
        headers,
        params,
      }
    );
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
          // Emitir evento para notificar que las ofertas cambiaron
          this.offersChangedSubject.next();
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

  updateJobOffer(id: number, jobOffer: JobOffer): Observable<JobOffer> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    jobOffer.releaseDate = new Date();
    return this.http.put<JobOffer>(`${this.urlOffersManagement}/${id}`, jobOffer, {
      headers,
    });
  }

  getJobOfferById(id: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.urlJobOffers}/get/${id}`);
  }
}
