import { Candidate } from './../model/candidate';
import { UserData } from 'src/app/model/userData';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlEndpoint: string = 'http://localhost:30030/auth';
  private urlUserProfile: string = 'http://localhost:30030/user';
  private urlUserData: string = 'http://localhost:30030/userdata';

  private userDataSubject = new BehaviorSubject<UserData | null>(null);
  userData$ = this.userDataSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        this.userDataSubject.next(JSON.parse(storedUserData));
      } catch (e) {
        console.error('Error parsing stored user data:', e);
        localStorage.removeItem('userData');
      }
    }
  }

  setUserData(data: UserData | null): void {
    this.userDataSubject.next(data);
    if (data) {
      localStorage.setItem('userData', JSON.stringify(data));
    } else {
      localStorage.removeItem('userData');
    }
  }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    });

    return this.http
      .post(`${this.urlEndpoint}/signin`, body, {
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

  signUpCandidate(
    login: string,
    password: string,
    name: string,
    surname: string,
    email: string,
    phone: string
  ): Observable<any> {
    const user: User = {
      email,
      login,
      password,
      role_id: 3,
    };

    const candidate: Candidate = {
      name,
      surname,
      phone,
      user: user,
      birthdate: undefined,
    };

    const userData: UserData = {
      user: user,
      candidate: candidate,
      company: undefined,
    };

    return this.http
      .post(`${this.urlEndpoint}/signup`, userData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        map((response: any) => {
          console.log('Registration successful:', response);
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

    if (error.status === 0) {
      errorMessage =
        'Error de conexión. Por favor, verifica tu conexión a internet.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else if (error.status === 401) {
      errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
      this.logout();
    } else if (error.status === 409) {
      return throwError(() => error);
    } else if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error del servidor: ${error.status} - ${error.statusText}`;
      }
    } else {
      errorMessage = `Error del servidor: ${error.status} - ${error.statusText}`;
    }

    console.error('Error en la petición:', error);
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
          localStorage.setItem('userData', JSON.stringify(userData));
          return userData;
        }),
        catchError(this.handleError)
      );
  }
}