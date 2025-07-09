import { UserData } from './../model/userData';
import { Injectable, OnInit } from '@angular/core';
import { Company } from '../model/company';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { UsersService } from './users.service';
import { User } from '../model/user';
import { JobOffer } from '../model/jobOffer';

@Injectable({
  providedIn: 'root',
})
export class CompanyService implements OnInit {
  private urlEndpoint: string = 'http://localhost:30030/auth';
  private urlCompanyProfile: string = 'http://localhost:30030/company';

  private companySubject = new BehaviorSubject<Company | null>(null);
  company$ = this.companySubject.asObservable();

  userData: UserData | null = null;
  company: Company | null = null;
  constructor(private http: HttpClient, private userService: UsersService) {}
  ngOnInit(): void {
    this.userService.userData$.subscribe((userData) => {
      this.userData = userData;
    });
  }
  getCompanyProfile(): Observable<Company> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Company>(`${this.urlCompanyProfile}/getCompany`, {
      headers,
    });
  }
  getAllCompanies(): Observable<Company[]> {
    const token = localStorage.getItem('token'); // Get the token
    if (!token) {
      console.error(
        'Token is missing for getAllCompanies. User not logged in?'
      );
      return throwError(() => new Error('Authentication token is missing.'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Company[]>(
      `${this.urlCompanyProfile}/getAllCompanies`,
      {
        headers,
      }
    );
  }
}
