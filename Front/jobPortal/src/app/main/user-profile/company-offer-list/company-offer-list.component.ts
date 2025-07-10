import { LoadingScreenService } from './../../../services/loading-screen.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobOffer } from 'src/app/model/jobOffer';
import { JobOfferService } from 'src/app/services/job-offer.service';

@Component({
  selector: 'app-company-offer-list',
  templateUrl: './company-offer-list.component.html',
  styleUrls: ['./company-offer-list.component.css'],
})
export class CompanyOfferListComponent implements OnInit {
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
    | 'beneficios' = 'releaseDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchTerm: string = '';

  constructor(
    private jobOfferService: JobOfferService,
    private breakpointObserver: BreakpointObserver,
    private loadingScreenService: LoadingScreenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadingScreenService.show();
    this.jobOfferService
      .getJobOffersByCompanySorted('releaseDate', 'desc')
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
      .getJobOffersByCompanySorted(this.sortBy, this.sortDirection)
      .subscribe({
        next: (offers) => {
          this.jobOffers = offers;
          console.log('Ofertas ordenadas:', offers);
        },
        error: (error) => {
          console.error('Error sorting job offers:', error);
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
    
    this.router.navigate(['/main/offerDetails', id]).then(success => {
      if (!success) {
        console.error('Error en navegación: Ruta no encontrada');
      }
    });
    
  } catch (error) {
    console.error('Error al navegar a detalles:', error);
    // Opcional: Mostrar mensaje al usuario
    // this.snackBar.open('Error al abrir detalles', 'Cerrar');
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
}
