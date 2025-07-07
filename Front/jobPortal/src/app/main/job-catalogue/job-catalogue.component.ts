import { UserData } from 'src/app/model/userData';
import { Component, OnInit } from '@angular/core';
import { JobOffer } from 'src/app/model/jobOffer';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ApplicationService } from 'src/app/services/application.service';
import { UsersService } from 'src/app/services/users.service';
import { switchMap, filter, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

@Component({
  selector: 'app-job-catalogue',
  templateUrl: './job-catalogue.component.html',
  styleUrls: ['./job-catalogue.component.css'],
})
export class JobCatalogueComponent implements OnInit {
  userData: UserData | null = null;
  jobOffers: JobOffer[] = [];
  gridCols: number = 3;
  sortBy: 'id' | 'title' | 'releaseDate' | 'description' | 'company' | 'email' =
    'releaseDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchTerm: string = '';
  appliedOfferIds: number[] = [];

  constructor(
    private jobOfferService: JobOfferService,
    private breakpointObserver: BreakpointObserver,
    private applicationService: ApplicationService,
    public usersService: UsersService,
    private _snackBar: MatSnackBar,
    private loadingScreenService: LoadingScreenService
  ) {}

  ngOnInit(): void {
    this.loadingScreenService.show();
    this.jobOfferService
      .getJobOfferSorted('releaseDate', 'desc')
      .subscribe({
        next: (offers) => {
          this.jobOffers = offers;
          this.sortBy = 'releaseDate';
          this.sortDirection = 'desc';
          this.loadingScreenService.hide();
        },
        error: (err) => {
          console.error('Error al cargar ofertas:', err);
          this.loadingScreenService.hide();
        },
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
        (applications: any[]) => {
          console.log('Successfully fetched user applications:', applications);
          this.appliedOfferIds = applications.map((app: any) => app.offerId);
          console.log('Applied offer IDs after fetch:', this.appliedOfferIds);
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
          this.jobOffers = offers;
          console.log('Ofertas ordenadas:', offers);
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
        this.jobOffers = offers;
        console.log('Ofertas filtradas:', offers);
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
        alert(res);
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

  openSnackBar(message: string, panelClass: string = '') {
    this._snackBar.open(message, 'Cerrar', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
}
