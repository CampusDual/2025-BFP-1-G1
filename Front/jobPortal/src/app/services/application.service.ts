import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private apiUrl = 'http://localhost:30030/applications'; // BASE URL CORRECTA

  constructor(private http: HttpClient) {}

  getUserApplications(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn(
        'No token found for getUserApplications. Request might fail.'
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/user`, { headers });
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
}
