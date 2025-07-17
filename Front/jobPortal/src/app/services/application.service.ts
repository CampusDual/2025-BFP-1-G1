import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Application } from '../model/application';
import { Candidate } from '../model/candidate';

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

  getApplicationsByOfferId(offerId: number): Observable<Application[]> {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Application[]>(`${this.apiUrl}/offer/${offerId}`, {
      headers,
    });
  }
  /* getApplicationInscriptionDateById(applicationId: number): Observable<string> {
    const token = localStorage.getItem('token');
    if (!token) {
      const errorMsg =
        'No token found in localStorage. User might not be authenticated.';
      console.error(errorMsg);
      return new Observable((observer) => {
        observer.error(new Error(errorMsg));
      });
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const url = `${this.apiUrl}/${applicationId}`;
    return this.http
      .get<Application>(url, { headers })
      .pipe(map((application) => application.inscriptionDate));
  }*/
  getCandidatesByJobOffer(offerId: number): Observable<Candidate[]> {
    //
    const token = localStorage.getItem('token');

    if (!token) {
      const errorMsg =
        'No token found in localStorage. User might not be authenticated to view candidates.';
      console.error(errorMsg);
      return new Observable((observer) => observer.error(new Error(errorMsg)));
    }

    console.log('Fetching candidates for offer ID:', offerId, 'with token.');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Pass the JWT token for authentication
    });

    const url = `${this.apiUrl}/getcandidates/${offerId}`;
    console.log('Making GET request to:', url);

    // Make the HTTP GET request and expect an array of Candidate
    return this.http.get<Candidate[]>(url, { headers }).pipe(
      //                          ^^^^^^^^^^ Correctly expecting Candidate[]
      map((candidates) => {
        console.log('Received candidates:', candidates);
        return candidates;
      })
    );
  }
}
