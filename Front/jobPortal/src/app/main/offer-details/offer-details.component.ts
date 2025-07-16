import { Candidate } from './../../model/candidate';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOffer } from 'src/app/model/jobOffer';
import { UserData } from 'src/app/model/userData';
import { ApplicationService } from 'src/app/services/application.service';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { UsersService } from 'src/app/services/users.service';
import { filter, tap, Observable, of } from 'rxjs'; // Import Observable and of
import { Location } from '@angular/common';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css'],
})
export class OfferDetailsComponent implements OnInit {
  offer!: JobOffer;
  // Change userData to an Observable
  userData$: Observable<UserData | null> = of(null); // Initialize with null or undefined
  appliedOfferIds: number[] = [];
  candidate: Candidate | null = null;
  offerCandidates: Candidate[] = [];
  isLoadingCandidates: boolean = false;
  errorLoadingCandidates: string | null = null;
  displayedColumns: string[] = ['name', 'email', 'phone', 'birthdate'];

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

    // Assign the userData$ directly from the service and handle initial fetch
    this.userData$ = this.usersService.userData$.pipe(
      tap((data) => {
        // If data is null/undefined and user is logged in, try to fetch it
        if (!data && this.usersService.isLoggedIn()) {
          this.usersService.getUserData().subscribe();
        }
      })
      // No need for filter((data) => data !== null) here, let the template handle null
    );

    // Subscribe to userData$ to trigger side effects (loading applications, candidates)
    // This subscription runs when userData$ emits a new value.
    this.userData$.subscribe((data) => {
      if (data) {
        // Ensure data is not null before using it for checks
        if (this.isCandidate(data)) {
          this.applicationService.getUserApplications().subscribe({
            next: (applications: any[]) => {
              this.appliedOfferIds = applications.map(
                (app: any) => app.offerId
              );
            },
            error: (err) => {
              console.error('Error al obtener aplicaciones del usuario:', err);
            },
          });
        }

        // Only load candidates if offer is loaded and user data is available
        if (this.offer && (this.isOfferOwner(data) || this.isAdmin(data))) {
          this.loadCandidatesForOffer(id);
        }
      }
    });

    if (id) {
      this.jobService.getJobOfferById(id).subscribe({
        next: (data: JobOffer) => {
          this.offer = data;
          // Optionally, if offer loading also influences visibility based on user roles
          // and userData might already be available, you could re-trigger checks.
          // However, the userData$ subscription above should handle most cases.
        },
        error: (err) => {
          console.error('Error al cargar la oferta:', err);
          this.router.navigate(['main/catalogue']);
        },
      });
    } else {
      this.router.navigate(['main/catalogue']);
    }
  }

  // Update these methods to accept userData as an argument
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

  isAdmin(userData: UserData | null): boolean {
    return (
      !!userData?.admin || (!!userData?.user && userData.user.role_id === 1)
    );
  }

  // ... (rest of your methods remain the same)
  goBack(): void {
    this.location.back();
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
        this.appliedOfferIds = [...this.appliedOfferIds]; // Trigger change detection for array mutation
      },
      error: (err) => {
        let errorMessage =
          'Error al aplicar a la oferta. Inténtalo de nuevo más tarde.';
        if (err.status === 409) {
          errorMessage = err.error || 'Ya estás inscrito a esta oferta';
          if (!this.appliedOfferIds.includes(oferta.id)) {
            this.appliedOfferIds.push(oferta.id);
            this.appliedOfferIds = [...this.appliedOfferIds]; // Trigger change detection
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
}
