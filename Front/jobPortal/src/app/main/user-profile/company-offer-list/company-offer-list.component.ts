import { LoadingScreenService } from './../../../services/loading-screen.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core'; // Añadir OnDestroy
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JobOffer } from 'src/app/model/jobOffer';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { Subscription } from 'rxjs'; // Importar Subscription

@Component({
  selector: 'app-company-offer-list',
  templateUrl: './company-offer-list.component.html',
  styleUrls: ['./company-offer-list.component.css'],
})
export class CompanyOfferListComponent implements OnInit, OnDestroy {
  // Implementar OnDestroy
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
    | 'isActive'
    | 'requisitos'
    | 'deseables'
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
    this.loadCompanyOffers(); // Usar un método para cargar ofertas iniciales

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

    // Suscripción para recargar ofertas cuando cambien (ej. al activar/desactivar)
    this.offersChangedSubscription = this.jobOfferService
      .getOffersChangedObservable()
      .subscribe(() => {
        this.loadCompanyOffers(); // Recargar las ofertas cuando haya un cambio
      });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    this.offersChangedSubscription?.unsubscribe();
  }

  // Método para cargar las ofertas de la compañía
  loadCompanyOffers(): void {
    this.jobOfferService
      .getJobOffersByCompanySorted(this.sortBy, this.sortDirection)
      .subscribe({
        next: (offers) => {
          this.jobOffers = offers;
          this.loadingScreenService.hide();
        },
        error: (err) => {
          console.error('Error al cargar ofertas de la compañía:', err);
          this.snackBar.open('Error al cargar ofertas', 'Cerrar', {
            duration: 3000,
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
          console.log('Ofertas ordenadas:', offers);
        },
        error: (error) => {
          console.error('Error sorting job offers:', error);
          this.snackBar.open('Error al ordenar ofertas de trabajo', 'Cerrar', {
            duration: 3000,
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
          console.log('Ofertas filtradas:', offers);
        },
        error: (error) => {
          console.error('Error filtering job offers:', error);
          this.snackBar.open('Error al filtrar ofertas de trabajo', 'Cerrar', {
            duration: 3000,
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
          console.error('Error en navegación: Ruta no encontrada');
        }
      });
    } catch (error) {
      this.snackBar.open('Error al abrir detalles', 'Cerrar', {
        duration: 3000,
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

  onToggleOfferStatus(offerId: number, currentStatus: boolean): void {
    const newStatus = !currentStatus;

    this.jobOfferService.updateJobOfferStatus(offerId, newStatus).subscribe({
      next: (updatedOffer) => {
        const index = this.jobOffers.findIndex((o) => o.id === updatedOffer.id);
        if (index !== -1) {
          this.jobOffers[index].isActive = updatedOffer.isActive;
        }
        this.snackBar.open(
          `Oferta ${updatedOffer.title} ${
            newStatus ? 'activada' : 'desactivada'
          } con éxito.`,
          'Cerrar',
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
      },
      error: (error) => {
        console.error('Error al cambiar el estado de la oferta:', error);
        this.snackBar.open(
          'Error al cambiar el estado de la oferta. Inténtalo de nuevo.',
          'Cerrar',
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      },
    });
  }
}
