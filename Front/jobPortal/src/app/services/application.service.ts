import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Application } from '../model/application';
import { Candidate } from '../model/candidate'; // Mantén si lo usas en otro lugar o para construir la vista de candidatos

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private apiUrl = 'http://localhost:30030/applications';

  constructor(private http: HttpClient) {}

  getUserApplications(): Observable<any> {
    console.log('ApplicationService: Getting user applications...');
    const token = localStorage.getItem('token');

    if (!token) {
      const errorMsg =
        'No token found in localStorage. User might not be authenticated.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    console.log(
      'Using token for request:',
      token ? 'Token exists' : 'No token'
    );

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/user`;
    console.log('Making GET request to:', url);

    return new Observable((observer) => {
      this.http.get<any>(url, { headers }).subscribe({
        next: (response) => {
          console.log('ApplicationService: Received response:', response);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          console.error(
            'ApplicationService: Error fetching applications:',
            error
          );
          if (error.status === 401) {
            console.error(
              'Authentication failed. Token might be invalid or expired.'
            );
          }
          observer.error(error);
        },
      });
    });
  }

  aplicarAOferta(ofertaId: number): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Token en aplicarAOferta:', token, 'OfertaId:', ofertaId);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(
      `${this.apiUrl}/apply?offerId=${ofertaId}`,
      {},
      {
        headers,
        responseType: 'text',
      }
    );
  }

  getApplicationsForOffer(offerId: number): Observable<Application[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Authentication token not found.');
      return new Observable((observer) =>
        observer.error(new Error('Authentication token not found.'))
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/offer/${offerId}`;
    console.log('Making GET request to:', url);

    return this.http.get<Application[]>(url, { headers });
  }

  getCandidatesOnlyForOffer(offerId: number): Observable<Candidate[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authentication token not found for candidates.');
      return new Observable((observer) =>
        observer.error(new Error('Authentication token not found.'))
      );
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const url = `${this.apiUrl}/getcandidates/${offerId}`;
    return this.http.get<Candidate[]>(url, { headers });
  }
}
