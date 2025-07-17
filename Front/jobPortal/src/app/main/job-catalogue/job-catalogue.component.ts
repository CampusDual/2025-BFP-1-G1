import { UserData } from 'src/app/model/userData';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { JobOffer } from 'src/app/model/jobOffer';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ApplicationService } from 'src/app/services/application.service';
import { UsersService } from 'src/app/services/users.service';
import { switchMap, filter, tap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-catalogue',
  templateUrl: './job-catalogue.component.html',
  styleUrls: ['./job-catalogue.component.css'],
})
export class JobCatalogueComponent implements OnInit, OnDestroy {
  userData: UserData | null = null;
  jobOffers: JobOffer[] = [];
  gridCols: number = 3;
  sortBy:
    | 'id'
    | 'title'
    | 'releaseDate'
    | 'description'
    | 'company'
    | 'email'
    | 'localizacion'
    | 'modalidad'
    | 'requisitos'
    | 'deseables'
    | 'beneficios'
    | 'active' = 'releaseDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchTerm: string = '';
  appliedOfferIds: number[] = [];

  private offersChangedSubscription?: Subscription;

  constructor(
    private jobOfferService: JobOfferService,
    private breakpointObserver: BreakpointObserver,
    private applicationService: ApplicationService,
    public usersService: UsersService,
    private _snackBar: MatSnackBar,
    private loadingScreenService: LoadingScreenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadingScreenService.show();

    this.jobOfferService.getJobOfferSorted('releaseDate', 'desc').subscribe({
      next: (offers) => {
        this.jobOffers = offers.filter((offer) => offer.active);
        this.sortBy = 'releaseDate';
        this.sortDirection = 'desc';
        this.loadingScreenService.hide();
      },
      error: (err) => {
        console.error('Error al cargar ofertas:', err);
        this.loadingScreenService.hide();
      },
    });

    this.offersChangedSubscription = this.jobOfferService
      .getOffersChangedObservable()
      .subscribe(() => {
        this.loadOffers();
      });

    this.usersService.userData$
      .pipe(
        tap((data) => {
          if (!data && this.usersService.isLoggedIn()) {
            console.log('User data is null, attempting to fetch...');
            this.usersService.getUserData().subscribe();
          }
        }),
        filter((data) => data !== null),
        switchMap((userData) => {
          this.userData = userData;
          if (this.isCandidate()) {
            console.log('User is candidate, fetching applications...');
            return this.applicationService.getUserApplications();
          } else {
            console.log('User is not a candidate, clearing applied offers.');
            this.appliedOfferIds = [];
            return of([]);
          }
        })
      )
      .subscribe(
        (response: any) => {
          try {
            const apps = Array.isArray(response)
              ? response
              : response?.applications || [];
            console.log('Successfully fetched user applications:', apps);
            this.appliedOfferIds = apps.map((app: any) => app.offerId);
            console.log('Applied offer IDs after fetch:', this.appliedOfferIds);
          } catch (error) {
            console.error('Error processing user applications:', error);
            this.appliedOfferIds = [];
          }
        },
        (error) => {
          console.error('Error fetching user applications:', error);
          this.appliedOfferIds = [];
        }
      );

    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.gridCols = 1;
          } else if (result.breakpoints[Breakpoints.Small]) {
            this.gridCols = 1;
          } else if (result.breakpoints[Breakpoints.Medium]) {
            this.gridCols = 2;
          } else if (result.breakpoints[Breakpoints.Large]) {
            this.gridCols = 3;
          } else if (result.breakpoints[Breakpoints.XLarge]) {
            this.gridCols = 4;
          }
        }
      });
  }

  loadOffers(): void {
    this.jobOfferService
      .getJobOfferSorted(this.sortBy, this.sortDirection)
      .subscribe({
        next: (offers) => {
          this.jobOffers = offers.filter((offer) => offer.active);
        },
        error: (err) => {
          console.error('Error al recargar ofertas:', err);
        },
      });
  }

  isTruncated(element: HTMLElement): boolean {
    return element.scrollWidth > element.clientWidth;
  }

  sortOffers(field: keyof JobOffer, direction?: 'asc' | 'desc') {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'desc';
    }

    this.jobOfferService
      .getJobOfferSorted(this.sortBy, this.sortDirection)
      .subscribe({
        next: (offers) => {
          this.jobOffers = offers.filter((offer) => offer.active);
          console.log('Ofertas ordenadas y filtradas:', this.jobOffers);
        },
        error: (error) => {
          console.error('Error sorting job offers:', error);
          this.openSnackBar('Error al ordenar las ofertas de trabajo', 'error');
        },
      });
  }

  getFilteredOffers(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.jobOfferService.getJobOffersFiltered(lowerCaseSearchTerm).subscribe({
      next: (offers) => {
        this.jobOffers = offers.filter((offer) => offer.active);
        console.log(
          'Ofertas filtradas por búsqueda y activas:',
          this.jobOffers
        );
      },
      error: (error) => {
        console.error('Error filtering job offers:', error);
        this.openSnackBar('Error al filtrar ofertas de trabajo', 'error');
      },
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

  isCandidate(): boolean {
    return (
      !!this.userData?.candidate ||
      (!!this.userData?.user && this.userData.user.role_id === 3)
    );
  }

  isCompany(): boolean {
    return (
      !!this.userData?.company ||
      (!!this.userData?.user && this.userData.user.role_id === 2)
    );
  }

  isAdmin(): boolean {
    return (
      !!this.userData?.admin ||
      (!!this.userData?.user && this.userData.user.role_id === 1)
    );
  }

  openSnackBar(message: string, panelClass: string = '') {
    this._snackBar.open(message, 'Cerrar', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }

  getRelativeDate(dateInput: string | Date): string {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      return date.toLocaleDateString();
    } else if (diffDays >= 1) {
      return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours >= 1) {
        return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
      }
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes >= 1) {
        return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
      }
      return 'Hace unos segundos';
    }
  }

  ngOnDestroy(): void {
    this.offersChangedSubscription?.unsubscribe();
  }

  goToOfferDetails(id: number) {
    console.log('Navegando a detalles de oferta con id:', id);
    this.router.navigate(['/main/offerDetails', id]);
  }
}
