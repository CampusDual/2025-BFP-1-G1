import { Candidate } from '../model/candidate';
import { UserData } from './../model/userData';
import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Education } from '../model/education';
import { WorkExperience } from '../model/workExperience';

@Injectable({
  providedIn: 'root',
})
export class CandidateProfileService {
  private urlCandidateProfile = 'http://localhost:30030/candidate';
  private urlCandidateEducation = 'http://localhost:30030/education';
  private urlCandidateWorkExperience = 'http://localhost:30030/experience';

  userData: UserData | null = null;
  candidate: Candidate | null = null;
  education: Education[] = [];
  workExperience: WorkExperience[] = [];

  constructor(private http: HttpClient, private userService: UsersService) {}

  ngOnInit(): void {
    this.userService.userData$.subscribe((userData) => {
      this.userData = userData;
    });
  }

  getCandidateProfile(): Observable<Candidate> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Candidate>(
      `${this.urlCandidateProfile}/getCandidate`,
      { headers }
    );
  }

  updateCandidateProfile(candidate: Candidate): Observable<Candidate> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put<Candidate>(
      `${this.urlCandidateProfile}/update`,
      candidate,
      { headers }
    );
  }


  getAllEducation(): Observable<Education[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Education[]>(`${this.urlCandidateEducation}/all`, {
      headers,
    });
  }

  getAllWorkExperience(): Observable<WorkExperience[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<WorkExperience[]>(
      `${this.urlCandidateWorkExperience}/all`,
      { headers }
    );
  }

  getEducationById(id: number): Observable<Education> {
    const token = localStorage.getItem('token');
    const body = { id };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Education>(
      `${this.urlCandidateEducation}/getEducation`,
      body,
      { headers }
    );
  }

  getWorkExperienceById(id: number): Observable<WorkExperience> {
    const token = localStorage.getItem('token');
    const body = { id };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<WorkExperience>(
      `${this.urlCandidateWorkExperience}/getExperience`,
      body,
      { headers }
    );
  }

  addEducation(education: Education): Observable<Education> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<Education>(
      `${this.urlCandidateEducation}/insertEducation`,
      education,
      { headers }
    );
  }

  addWorkExperience(workExperience: WorkExperience): Observable<WorkExperience> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<WorkExperience>(
      `${this.urlCandidateWorkExperience}/insertExperience`,
      workExperience,
      { headers }
    );
  }

  updateEducation(education: Education): Observable<Education> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put<Education>(
      `${this.urlCandidateEducation}/updateEducation`,
      education,
      { headers }
    );
  }

  updateWorkExperience(
    workExperience: WorkExperience
  ): Observable<WorkExperience> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put<WorkExperience>(
      `${this.urlCandidateWorkExperience}/updateExperience`,
      workExperience,
      { headers }
    );
  }

 getEducationByCandidateId(idCandidate: number): Observable<Education[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  return this.http.get<Education[]>(`${this.urlCandidateEducation}/candidate/${idCandidate}`, { headers }).pipe(
    catchError((error) => {
      console.error('Error al obtener la educación del candidato:', error);
      return throwError(() => error);
    })
  );
}

getExperienceByCandidateId(idCandidate: number): Observable<WorkExperience[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  return this.http.get<WorkExperience[]>(`${this.urlCandidateWorkExperience}/candidate/${idCandidate}`, { headers }).pipe(
    catchError((error) => {
      console.error('Error al obtener la experiencia del candidato:', error);
      return throwError(() => error);
    })
  );
}

}
