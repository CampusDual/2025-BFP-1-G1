import { LoadingScreenService } from './../../../services/loading-screen.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JobOffer } from 'src/app/model/jobOffer';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-offer-list',
  templateUrl: './company-offer-list.component.html',
  styleUrls: ['./company-offer-list.component.css'],
})
export class CompanyOfferListComponent implements OnInit, OnDestroy {
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
    | 'active'
    | 'beneficios' = 'releaseDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchTerm: string = '';

  private offersChangedSubscription?: Subscription;

  constructor(
    private jobOfferService: JobOfferService,
    private breakpointObserver: BreakpointObserver,
    private loadingScreenService: LoadingScreenService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadingScreenService.show();
    this.loadCompanyOffers();

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

    this.offersChangedSubscription = this.jobOfferService
      .getOffersChangedObservable()
      .subscribe(() => {
        this.loadCompanyOffers();
      });
  }

  ngOnDestroy(): void {
    this.offersChangedSubscription?.unsubscribe();
  }

  loadCompanyOffers(): void {
    this.jobOfferService
      .getJobOffersByCompanySorted(this.sortBy, this.sortDirection)
      .subscribe({
        next: (offers) => {
          this.jobOffers = offers;
          this.loadingScreenService.hide();
        },
        error: (err) => {
          this.snackBar.open('Error al cargar ofertas', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
          this.loadingScreenService.hide();
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
      .getJobOffersByCompanySorted(this.sortBy, this.sortDirection)
      .subscribe({
        next: (offers) => {
          this.jobOffers = offers;
        },
        error: (error) => {
          this.snackBar.open('Error al ordenar ofertas de trabajo', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        },
      });
  }

  getFilteredOffers(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.jobOfferService
      .getJobOffersByCompanyFiltered(lowerCaseSearchTerm)
      .subscribe({
        next: (offers) => {
          this.jobOffers = offers;
        },
        error: (error) => {
          this.snackBar.open('Error al filtrar ofertas de trabajo', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        },
      });
  }

  goToOfferDetails(id: number): void {
    try {
      if (id === undefined || id === null) {
        throw new Error('ID de oferta no definido');
      }

      if (isNaN(Number(id))) {
        throw new Error('ID de oferta no es un número válido');
      }

      this.router.navigate(['/main/offerDetails', id]).then((success) => {
        if (!success) {
          // No se puede usar console.error aquí porque se ha pedido eliminar logs.
          // En un entorno de producción, esto podría ser un log a un servicio de monitoreo.
        }
      });
    } catch (error) {
      this.snackBar.open('Error al abrir detalles', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
      });
    }
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
      // } else { // El "else" de este bloque if-else-if no estaba completo
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

  onToggleOfferStatus(offer: JobOffer): void {
    if (offer.id === undefined) {
      this.snackBar.open('ID de oferta no válido.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    const originalActiveStatus = offer.active;
    const newStatus = !originalActiveStatus;

    const offerIndex = this.jobOffers.findIndex((o) => o.id === offer.id);

    if (offerIndex !== -1) {
      this.jobOffers[offerIndex].active = newStatus;
    }

    this.jobOfferService.updateJobOfferStatus(offer.id, newStatus).subscribe({
      next: (updatedOffer) => {
        if (offerIndex !== -1) {
          this.jobOffers[offerIndex].active = updatedOffer.active;
        }

        this.snackBar.open(
          `Oferta "${updatedOffer.title}" ${
            updatedOffer.active ? 'activada' : 'desactivada'
          } con éxito.`,
          'Cerrar',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['successSnackbar'],
          }
        );
        this.loadingScreenService.hide();
      },
      error: (error) => {
        this.loadingScreenService.hide();

        this.snackBar.open(
          'Error al cambiar el estado de la oferta. Revirtiendo cambio.',
          'Cerrar',
          { duration: 5000, panelClass: ['errorSnackbar'] }
        );

        if (offerIndex !== -1) {
          this.jobOffers[offerIndex].active = originalActiveStatus;
        }
      },
    });
  }
}
