import { Candidate } from './../../model/candidate';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOffer } from 'src/app/model/jobOffer';
import { UserData } from 'src/app/model/userData';
import { ApplicationService } from 'src/app/services/application.service';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { UsersService } from 'src/app/services/users.service';
import {
  filter,
  tap,
  Observable,
  of,
  combineLatest,
  switchMap,
  forkJoin,
  map,
} from 'rxjs';
import { Location } from '@angular/common';
import { Application } from 'src/app/model/application';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css'],
})
export class OfferDetailsComponent implements OnInit {
  offer!: JobOffer;
  userData$: Observable<UserData | null> = of(null);
  appliedOfferIds: number[] = [];
  candidate: Candidate | null = null;
  offerCandidates: Candidate[] = [];
  isLoadingCandidates: boolean = false;
  offerApplications: any[] = [];
  errorLoadingCandidates: string | null = null;
  displayedColumns: string[] = [
    'candidateName',
    'candidateEmail',

    'inscriptionDate',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobOfferService,
    private applicationService: ApplicationService,
    private usersService: UsersService,
    public _snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    const offer$ = this.jobService.getJobOfferById(id).pipe(
      tap({
        next: (data: JobOffer) => (this.offer = data),
        error: (err) => {
          console.error('Error al cargar la oferta:', err);
          this.router.navigate(['main/catalogue']);
        },
      }),
      filter((data) => !!data)
    );

    this.userData$ = this.usersService.userData$.pipe(
      tap((data) => {
        if (!data && this.usersService.isLoggedIn()) {
          this.usersService.getUserData().subscribe();
        }
      })
    );

    combineLatest([
      this.userData$.pipe(filter((data) => !!data)),
      offer$,
    ]).subscribe(([userData, offer]) => {
      if (this.isCandidate(userData)) {
        this.applicationService.getUserApplications().subscribe({
          next: (applications: any[]) => {
            this.appliedOfferIds = applications.map((app: any) => app.offerId);
          },
          error: (err) => {
            console.error('Error al obtener aplicaciones del usuario:', err);
          },
        });
      }

      if (this.isOfferOwner(userData) || this.isAdmin(userData)) {
        this.loadApplicationsAndCandidateDetails(id);
      }
    });

    if (!id) {
      this.router.navigate(['main/catalogue']);
    }
  }

  goBack(): void {
    this.location.back();
  }

  isCompany(userData: UserData | null): boolean {
    return (
      !!userData?.company || (!!userData?.user && userData.user.role_id === 2)
    );
  }

  isCandidate(userData: UserData | null): boolean {
    return (
      !!userData?.candidate || (!!userData?.user && userData.user.role_id === 3)
    );
  }

  isOfferOwner(userData: UserData | null): boolean {
    if (!userData?.user?.id || !this.offer?.company?.user?.id) {
      return false;
    }
    return userData.user.id === this.offer.company.user.id;
  }

  editOffer(): void {
    if (this.offer?.id) {
      this.router.navigate(['main/editOffer', this.offer.id]);
    }
  }

  openSnackBar(message: string, panelClass: string = '') {
    this._snackBar.open(message, 'Cerrar', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }

  aplicarAOferta(oferta: any) {
    this.applicationService.aplicarAOferta(oferta.id).subscribe({
      next: (res) => {
        this.openSnackBar(res, 'success');
        this.appliedOfferIds.push(oferta.id);
        this.appliedOfferIds = [...this.appliedOfferIds];
      },
      error: (err) => {
        let errorMessage =
          'Error al aplicar a la oferta. Inténtalo de nuevo más tarde.';
        if (err.status === 409) {
          errorMessage = err.error || 'Ya estás inscrito a esta oferta';
          if (!this.appliedOfferIds.includes(oferta.id)) {
            this.appliedOfferIds.push(oferta.id);
            this.appliedOfferIds = [...this.appliedOfferIds];
          }
        } else if (err.status === 401) {
          errorMessage =
            'No autorizado. Por favor, inicia sesión para aplicar.';
        }
        this.openSnackBar(errorMessage, 'error');
        console.error('Error applying to offer:', err);
      },
    });
  }

  loadCandidatesForOffer(offerId: number): void {
    this.isLoadingCandidates = true;
    this.errorLoadingCandidates = null;
    this.jobService.getCandidatesByJobOfferId(offerId).subscribe({
      next: (candidates: Candidate[]) => {
        this.offerCandidates = candidates;
        this.isLoadingCandidates = false;
        console.log(`Candidatos para la oferta ${offerId}:`, candidates);
      },
      error: (err) => {
        this.errorLoadingCandidates =
          'Error al cargar los candidatos para esta oferta.';
        this._snackBar.open(this.errorLoadingCandidates, 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
        });
        this.isLoadingCandidates = false;
        console.error('Error al cargar candidatos:', err);
      },
    });
  }

  isAdmin(userData: UserData | null): boolean {
    return (
      !!userData?.admin || (!!userData?.user && userData.user.role_id === 1)
    );
  }

  loadApplicationsAndCandidateDetails(offerId: number): void {
    this.isLoadingCandidates = true;
    this.errorLoadingCandidates = null;

    this.applicationService
      .getApplicationsByOfferId(offerId)
      .pipe(
        switchMap((applications: Application[]) => {
          if (applications.length === 0) {
            return of([]);
          }

          const candidateDetailsRequests = applications.map((app) =>
            this.usersService
              .getUserDataById(app.idCandidate)
              .pipe(
                map((candidate) => ({ ...app, candidateDetails: candidate }))
              )
          );
          return forkJoin(candidateDetailsRequests);
        })
      )
      .subscribe({
        next: (applicationsWithDetails: any[]) => {
          this.offerApplications = applicationsWithDetails.map((app) => ({
            ...app,

            candidateName: app.candidateDetails?.name,
            candidateEmail: app.candidateDetails?.user?.email,
            candidatePhone: app.candidateDetails?.phone,
            candidateBirthdate: app.candidateDetails?.birthdate,
          }));
          this.isLoadingCandidates = false;
          console.log(
            `Aplicaciones con detalles de candidato para la oferta ${offerId}:`,
            this.offerApplications
          );
        },
        error: (err) => {
          this.errorLoadingCandidates =
            'Error al cargar las aplicaciones y los detalles de los candidatos.';
          this._snackBar.open(this.errorLoadingCandidates, 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
          this.isLoadingCandidates = false;
          console.error('Error al cargar aplicaciones y candidatos:', err);
        },
      });
  }
}
