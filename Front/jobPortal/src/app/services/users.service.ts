import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlEnpoint: string = 'http://localhost:30030/auth';
  private urlUserProfile: string = 'http://localhost:30030/user';

  constructor(private http: HttpClient) {}
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    });
    return this.http.post(`${this.urlEnpoint}/signin`, body, { headers, responseType: 'text'})
  }

getUserProfile(): Observable<User> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  return this.http.get<User>(`${this.urlEnpoint}/getUser'`, { headers });
}
}
