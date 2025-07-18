import { Candidate } from '../model/candidate';
import { UserData } from './../model/userData';
import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
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
    console.log('User Data:');
    this.userService.userData$.subscribe((userData) => {
      this.userData = userData;
    });
    this.getCandidateProfile().subscribe((candidate) => {
      this.candidate = candidate;
      console.log('Candidate Profile:', this.candidate);
    });
  }
  getCandidateById(id: number): Observable<Candidate> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get<Candidate>(`${this.urlCandidateProfile}/getcandidateById/${id}`, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  getCandidateProfile(): Observable<Candidate> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get<Candidate>(`${this.urlCandidateProfile}/getCandidate`, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
      if (error.status === 0) {
        errorMessage = 'Network error: Could not connect to the server.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized: Please log in again.';
      } else if (error.status === 404) {
        errorMessage = 'Candidate profile not found.';
      } else if (error.status === 500) {
        errorMessage = 'Server error: Something went wrong on the server.';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
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

  addWorkExperience(
    workExperience: WorkExperience
  ): Observable<WorkExperience> {
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

    return this.http
      .get<Education[]>(
        `${this.urlCandidateEducation}/candidate/${idCandidate}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Error al obtener la educación del candidato:', error);
          return throwError(() => error);
        })
      );
  }

  getExperienceByCandidateId(
    idCandidate: number
  ): Observable<WorkExperience[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .get<WorkExperience[]>(
        `${this.urlCandidateWorkExperience}/candidate/${idCandidate}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error(
            'Error al obtener la experiencia del candidato:',
            error
          );
          return throwError(() => error);
        })
      );
  }

  updateCandidateProfileWithImage(
    candidate: Candidate,
    imageFile: File
  ): Observable<Candidate> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append(
      'candidate',
      new Blob([JSON.stringify(candidate)], { type: 'application/json' })
    );
    formData.append('imageFile', imageFile, imageFile.name);

    return this.http
      .put<Candidate>(
        `${this.urlCandidateProfile}/update-with-image`,
        formData,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Error al actualizar el perfil con imagen:', error);
          return throwError(() => error);
        })
      );
  }
}
