import { UserData } from './../model/userData';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlEnpoint: string = 'http://localhost:30030/auth';
  private urlUserProfile: string = 'http://localhost:30030/user';
  private urlUserData: string = 'http://localhost:30030/userdata';

  private userDataSubject = new BehaviorSubject<UserData | null>(null);
  userData$ = this.userDataSubject.asObservable();

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
      .pipe(
        map((response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role_id);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getUserValue(): UserData | null {
    return this.userDataSubject.value;
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
  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;
    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (error) {
      return true;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.userDataSubject.next(null);
  }

  getUserData(): Observable<UserData> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(
        () =>
          new Error(
            'No se encontró el token de autentificación. Por favor, inicia sesión.'
          )
      );
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get<UserData>(`${this.urlUserData}/getuserdata`, { headers })
      .pipe(
        map((userData) => {
          this.userDataSubject.next(userData);
          return userData;
        }),
        catchError(this.handleError)
      );
  }
}
