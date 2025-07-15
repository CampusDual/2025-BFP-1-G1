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
          console.log('Ofertas de la compañía:', offers);
          this.loadingScreenService.hide();
        },
        error: (err) => {
          console.error('Error al cargar ofertas de la compañía:', err);
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
          console.log('Ofertas ordenadas:', offers);
        },
        error: (error) => {
          console.error('Error sorting job offers:', error);
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
          console.log('Ofertas filtradas:', offers);
        },
        error: (error) => {
          console.error('Error filtering job offers:', error);
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
          console.error('Error en navegación: Ruta no encontrada');
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
    console.log('----------------------------------------------------');
    console.log('INICIO: onToggleOfferStatus ejecutado.');
    console.log('Oferta recibida:', { ...offer });

    if (offer.id === undefined) {
      console.error('ERROR: ID de oferta es undefined. No se puede proceder.');
      this.snackBar.open('ID de oferta no válido.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    const originalActiveStatus = offer.active;
    const newStatus = !originalActiveStatus;
    console.log(
      `Estado original (originalActiveStatus): ${originalActiveStatus}`
    );
    console.log(`Nuevo estado calculado (newStatus): ${newStatus}`);

    const offerIndex = this.jobOffers.findIndex((o) => o.id === offer.id);
    console.log(`Buscando oferta con ID ${offer.id} en el array jobOffers.`);
    console.log(`Índice encontrado: ${offerIndex}`);

    if (offerIndex !== -1) {
      console.log('Aplicando actualización optimista en la UI...');
      console.log(
        `jobOffers[${offerIndex}].active ANTES de optimista: ${this.jobOffers[offerIndex].active}`
      );
      this.jobOffers[offerIndex].active = newStatus;
      console.log(
        `jobOffers[${offerIndex}].active DESPUÉS de optimista: ${this.jobOffers[offerIndex].active}`
      );
    } else {
      console.warn(
        'ADVERTENCIA: Oferta no encontrada en el array local jobOffers. La UI no se actualizará optimísticamente ni se revertirá en caso de error.'
      );
    }

    this.jobOfferService.updateJobOfferStatus(offer.id, newStatus).subscribe({
      next: (updatedOffer) => {
        console.log('Petición al backend exitosa (SUBSCRIBE - next).');
        console.log(
          'Respuesta completa del backend (updatedOffer):',
          updatedOffer
        );

        if (offerIndex !== -1) {
          console.log(
            `Confirmando estado de jobOffers[${offerIndex}].active con el valor del backend.`
          );
          console.log(`Valor del backend para active: ${updatedOffer.active}`);
          this.jobOffers[offerIndex].active = updatedOffer.active;
          console.log(
            `jobOffers[${offerIndex}].active DESPUÉS de confirmación backend: ${this.jobOffers[offerIndex].active}`
          );
        } else {
          console.warn(
            'ADVERTENCIA: Oferta no encontrada en el array local después de la respuesta exitosa del backend. No se pudo confirmar el estado.'
          );
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
        console.log('SnackBar de éxito mostrado.');
        this.loadingScreenService.hide();
        console.log('Spinner ocultado.');
        console.log('FIN: onToggleOfferStatus (ÉXITO).');
        console.log('----------------------------------------------------');
      },
      error: (error) => {
        console.error('Petición al backend FALLIDA (SUBSCRIBE - error).');
        console.error('Error completo:', error);

        this.loadingScreenService.hide();
        console.log('Spinner ocultado.');

        this.snackBar.open(
          'Error al cambiar el estado de la oferta. Revirtiendo cambio.',
          'Cerrar',
          { duration: 5000, panelClass: ['errorSnackbar'] }
        );
        console.log('SnackBar de error mostrado.');

        if (offerIndex !== -1) {
          console.log('Revirtiendo estado de la UI al original...');
          console.log(
            `jobOffers[${offerIndex}].active ANTES de revertir: ${this.jobOffers[offerIndex].active}`
          );
          this.jobOffers[offerIndex].active = originalActiveStatus;
          console.log(
            `jobOffers[${offerIndex}].active DESPUÉS de revertir: ${this.jobOffers[offerIndex].active}`
          );
        } else {
          console.warn(
            'ADVERTENCIA: Oferta no encontrada en el array local en el manejo de errores. No se pudo revertir el estado.'
          );
        }
        console.log('FIN: onToggleOfferStatus (ERROR).');
        console.log('----------------------------------------------------');
      },
    });
  }
}
