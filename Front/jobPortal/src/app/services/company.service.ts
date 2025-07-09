import { UserData } from './../model/userData';
import { Injectable, OnInit } from '@angular/core';
import { Company } from '../model/company';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsersService } from './users.service';
import { User } from '../model/user';

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
    const headers = new HttpHeaders({});
    return this.http.get<Company[]>(
      `${this.urlCompanyProfile}/getAllCompanies`,
      {
        headers,
      }
    );
  }
}
