import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, takeUntil, Subject } from 'rxjs';
import { UserData } from 'src/app/model/userData';
import { Application } from 'src/app/model/application';
import { JobOffer } from 'src/app/model/jobOffer';
import { UsersService } from 'src/app/services/users.service';
import { ApplicationService } from 'src/app/services/application.service';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css'],
})
export class CandidateProfileComponent implements OnInit, OnDestroy {
  userData: UserData | null = null;
  applications: Application[] = [];
  offerDetails: { [key: number]: JobOffer } = {};
  isLoading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private usersService: UsersService,
    private applicationService: ApplicationService,
    private jobOfferService: JobOfferService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    this.setLoading(true);

    this.usersService
      .getUserData()
      .pipe(
        finalize(() => this.setLoading(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => this.handleUserDataSuccess(data),
        error: (err) => this.handleUserDataError(err),
      });
  }

  private loadApplications(): void {
    if (!this.userData?.candidate?.id) {
      this.handleError('No se pudo identificar al candidato');
      return;
    }

    this.setLoading(true);

    this.applicationService
      .getUserApplications()
      .pipe(
        finalize(() => this.setLoading(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response: any) => {
          console.log('Applications response:', response);
          this.handleApplicationsSuccess(response);
        },
        error: (err) => this.handleApplicationsError(err),
      });
  }

  private loadOfferDetails(): void {
    if (!this.applications?.length) return;

    this.applications.forEach((app) => {
      const offerId = app.offerId;
      if (!offerId || this.offerDetails[offerId]) return;

      this.jobOfferService
        .getJobOfferById(offerId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (offer) => {
            if (offer) {
              this.offerDetails[offerId] = offer;
            }
          },
          error: (err) => console.error(`Error loading offer ${offerId}:`, err),
        });
    });
  }

  private handleUserDataSuccess(data: UserData): void {
    this.userData = data;

    if (!data?.candidate) {
      this.error = 'No tienes permisos para ver esta página. Redirigiendo...';
      setTimeout(() => this.router.navigate(['/main/catalogue']), 2000);
      return;
    }

    this.loadApplications();
  }

  private handleUserDataError(error: any): void {
    console.error('Error loading user data:', error);
    this.snackBar.open('Error al cargar los datos del usuario', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
    });

    if (error.status === 401) {
      this.router.navigate(['/auth/login']);
    }
  }

  private handleApplicationsSuccess(response: any): void {
    if (!response) {
      console.error('Empty response from server');
      return;
    }

    this.applications = Array.isArray(response)
      ? response
      : response.content || [];

    console.log('Applications loaded:', this.applications);

    if (this.applications.length > 0) {
      this.loadOfferDetails();
    }
  }

  private handleApplicationsError(error: any): void {
    console.error('Error loading applications:', error);

    let message = 'Error al cargar las candidaturas';
    if (error.status === 401) {
      message = 'La sesión ha expirado';
      setTimeout(() => this.router.navigate(['/auth/login']), 2000);
    } else if (error.status === 403) {
      message = 'No tienes permiso para ver estas candidaturas';
    } else if (error.status === 404) {
      message = 'No se encontraron candidaturas';
    }
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
    });
  }

  private setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    if (!isLoading) {
      this.error = null;
    }
  }

  private handleError(message: string): void {
    this.error = message;
    this.setLoading(false);
  }
}
