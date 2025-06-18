import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { User } from '../model/user';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlEnpoint: string = 'http://localhost:30030/auth';
  private urlUserProfile: string = 'http://localhost:30030/user';

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    });

    return this.http
      .post(`${this.urlEnpoint}/signin`, body, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  getUserProfile(): Observable<User> {
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
    return this.http
      .get<User>(`${this.urlUserProfile}/getUser`, { headers })
      .pipe(
        map(user => {
          this.userSubject.next(user);
          return user;
        }),        
        catchError(this.handleError)
      );
  }

  setUser(user: User){
    this.userSubject.next(user);
  }

  getUserValue(): User | null{
    return this.userSubject.value;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${
        error.message
      }\nRespuesta del servidor: ${JSON.stringify(error.error)}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; 
  }
}
