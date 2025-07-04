import { Component, OnInit } from '@angular/core';
import { JobOffer } from 'src/app/model/jobOffer';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'app-job-catalogue',
  templateUrl: './job-catalogue.component.html',
  styleUrls: ['./job-catalogue.component.css'],
})
export class JobCatalogueComponent implements OnInit {
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
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.jobOfferService.getJobOffers().subscribe((offers) => {
      this.jobOffers = offers;
      this.filteredJobOffers = offers;
      this.sortOffers('releaseDate', 'desc');
      console.log('Job offers:', offers);
    });

    this.applicationService
      .getUserApplications()
      .subscribe((applications: any[]) => {
        console.log('User applications:', applications);
        this.appliedOfferIds = applications.map((app: any) => app.offerId);
        console.log('Applied offer IDs:', this.appliedOfferIds);
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
      // Si el backend envía texto plano, que puede ser algo como:
      // "¡Aplicación enviada con éxito!" o "Ya estás inscrito a esta oferta"
      alert(res);
      this.appliedOfferIds.push(oferta.id);
    },
    error: (err) => {
      if (err.status === 409) {
        alert(err.error || 'Ya estás inscrito a esta oferta');
      } else if (err.status === 401) {
        alert('No autorizado. Por favor, inicia sesión.');
      } else {
        alert('Error al aplicar a la oferta. Inténtalo de nuevo más tarde.');
      }
    },
  });
}
}
