import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlEnpoint: string = 'http://localhost:30030/auth';

  constructor(private http: HttpClient) {}
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    });
    return this.http.post(`${this.urlEnpoint}/signin`, body, {
      headers,
      responseType: 'text',
    });
  }

  getUserProfile(username: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${username}:`),
    });
    return this.http.get(`${this.urlEnpoint}/user/${username}`, { headers }).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error al obtener el perfil del usuario:', error);
        return throwError(() => new Error('Error al obtener el perfil del usuario'));
      })
    );
  }
}
