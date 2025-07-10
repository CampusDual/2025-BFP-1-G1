import { Candidate } from './../model/candidate';
import { UserData } from 'src/app/model/userData';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { User } from '../model/user';
import { Company } from '../model/company';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlEndpoint: string = 'http://localhost:30030/auth';
  private urlUserProfile: string = 'http://localhost:30030/user';
  private urlUserData: string = 'http://localhost:30030/userdata';
  private urlCompanyProfile: string = 'http://localhost:30030/company';
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
      admin: undefined,
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
  handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.status === 401) {
      errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
      this.logout();
    } else if (error.status === 0) {
      errorMessage =
        'Error de conexión. Por favor, verifica tu conexión a internet.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
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
  };
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
  insertNewCompany(
    login: string,
    password: string,
    name: string,
    cif: string,
    email: string,
    phone: string,
    web: string,
    address: string
  ): Observable<any> {
    if (!this.isLoggedIn() || Number(this.getRole()) !== 1) {
      return throwError(
        () => new Error('No tienes permiso para crear una nueva empresa')
      );
    }

    const token = localStorage.getItem('token');

    const user: User = {
      email,
      login,
      password,
      role_id: 2,
    };
    const company: Company = {
      cif,
      name,
      phone,
      address,
      user: user,
      web,
    };
    const userData: UserData = {
      user: user,
      candidate: undefined,
      company: company,
      admin: undefined,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .post(`${this.urlCompanyProfile}/newCompany`, userData, { headers })
      .pipe(
        map((response: any) => {
          console.log('Registration successful:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }
  getRole(): string | null {
    const role = localStorage.getItem('role');
    return role;
  }
  getJobOffersCount(companyId: number): Observable<number> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(
        () => new Error('No se encontró el token de autentificación.')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    // Llamamos al nuevo endpoint
    const url = `${this.urlCompanyProfile}/${companyId}/job-offers-count`;

    return this.http
      .get<number>(url, { headers })
      .pipe(catchError(this.handleError));
  }
  deleteCompany(companyId: number): Observable<any> {
    if (!this.isLoggedIn() || Number(this.getRole()) !== 1) {
      return throwError(
        () => new Error('No tienes permiso para eliminar una empresa')
      );
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(
        () => new Error('No se encontró el token de autentificación.')
      );
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.urlCompanyProfile}/delete/${companyId}`;

    return this.http.delete(url, { headers }).pipe(
      map((response: any) => {
        console.log('Company deleted successfully:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }
}
