import { LoadingScreenService } from './../../../services/loading-screen.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
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
  sortBy: 'id' | 'title' | 'releaseDate' | 'description' | 'company'
  | 'email' | 'localizacion' | 'modalidad' | 'requisitos' | 'deseables' | 'beneficios' = 'releaseDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchTerm: string = '';

  constructor(
    private jobOfferService: JobOfferService,
    private breakpointObserver: BreakpointObserver,
    private loadingScreenService: LoadingScreenService
  ) {}

  ngOnInit(): void {
    this.loadingScreenService.show();
    this.jobOfferService.getJobOffersByCompanySorted('releaseDate', 'desc').subscribe({
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
}
