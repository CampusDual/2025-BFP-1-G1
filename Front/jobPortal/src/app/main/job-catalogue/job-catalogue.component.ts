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
  filteredJobOffers: JobOffer[] = [];
  appliedOfferIds: number[] = [];

  constructor(
    private jobOfferService: JobOfferService,
    private breakpointObserver: BreakpointObserver,
    private applicationService: ApplicationService,
    public usersService: UsersService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.jobOfferService.getJobOffers().subscribe((offers) => {
      this.jobOffers = offers;
      this.filteredJobOffers = offers;
      this.sortOffers('releaseDate', 'desc');
      console.log('Job offers loaded:', offers);
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

    this.jobOffers.sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];

      if (field === 'releaseDate') {
        valueA = valueA ? new Date(valueA as any).getTime() : 0;
        valueB = valueB ? new Date(valueB as any).getTime() : 0;
      }
      if (field === 'company') {
        valueA = a.company?.name ?? 0;
        valueB = b.company?.name ?? 0;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return 1;
      if (valueB == null) return -1;

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getFilteredOffers(): JobOffer[] {
    if (!this.searchTerm) {
      return this.jobOffers;
    }
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    return this.filteredJobOffers.filter(
      (offer) =>
        offer.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        offer.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  updateDisplayedOffers(): void {
    let currentOffers = this.getFilteredOffers();
    this.jobOffers = currentOffers;
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
