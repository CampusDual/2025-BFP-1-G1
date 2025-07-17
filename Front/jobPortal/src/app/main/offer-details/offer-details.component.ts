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
  // offerCandidates: Candidate[] = []; // This line might no longer be needed if using offerApplications
  isLoadingCandidates: boolean = false;
  offerApplications: any[] = []; // This will hold applications with candidate details
  errorLoadingCandidates: string | null = null;
  displayedColumns: string[] = [
    'candidateName',
    'candidateEmail',
    'inscriptionDate', // This should match the property name in offerApplications
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

      // Load applications and candidate details if the user is the offer owner or an admin
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

  // This method is now redundant if loadApplicationsAndCandidateDetails covers the need
  // for displaying candidate details for a company.
  // If you still need to load *only* CandidateDTOs without application details for some reason,
  // then you'd keep this and potentially adjust its usage.
  /*
  loadCandidatesForOffer(offerId: number): void {
    this.isLoadingCandidates = true;
    this.errorLoadingCandidates = null;
    this.applicationService.getCandidatesByJobOffer(offerId).subscribe({
      next: (candidates: CandidateDTO[]) => { // Use CandidateDTO[] here
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
  */

  isAdmin(userData: UserData | null): boolean {
    return (
      !!userData?.admin || (!!userData?.user && userData.user.role_id === 1)
    );
  }

  loadApplicationsAndCandidateDetails(offerId: number): void {
    this.isLoadingCandidates = true;
    this.errorLoadingCandidates = null;

    this.applicationService
      .getApplicationsByOfferId(offerId) // This fetches the Application objects
      .pipe(
        switchMap((applications: Application[]) => {
          if (applications.length === 0) {
            return of([]); // Return an empty array if no applications
          }

          // For each application, fetch the candidate's UserData
          const candidateDetailsRequests = applications.map((app) =>
            this.usersService.getUserDataById(app.idCandidate).pipe(
              map((userData: UserData) => ({
                // Combine application data with relevant candidate details
                id: app.id, // Application ID
                idOffer: app.offerId, // Offer ID
                idCandidate: app.idCandidate, // Candidate ID
                inscriptionDate: app.inscriptionDate, // Application's inscription date

                // Candidate details for the table
                candidateName: `${userData?.candidate?.name || ''} ${
                  userData?.candidate?.surname || ''
                }`.trim(),
                candidateEmail: userData?.user?.email || 'N/A',
                candidatePhone: userData?.candidate?.phone || 'N/A',
                candidateBirthdate: userData?.candidate?.birthdate || 'N/A',
                // Add other candidate details you might need later
              }))
            )
          );
          // Wait for all candidate details requests to complete
          return forkJoin(candidateDetailsRequests);
        })
      )
      .subscribe({
        next: (applicationsWithDetails: any[]) => {
          // applicationsWithDetails is already mapped to the desired format
          this.offerApplications = applicationsWithDetails;
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
