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
  sortBy: 'id' | 'title' | 'releaseDate' | 'description' | 'user' | 'email' =
    'releaseDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchTerm: string = '';
  filteredJobOffers: JobOffer[] = [];

  constructor(
    private jobOfferService: JobOfferService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.jobOfferService.getProfileOffers().subscribe((offers) => {
      this.jobOffers = offers;
      this.filteredJobOffers = offers;
      this.sortOffers('releaseDate', 'desc');
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

  sortOffers(field: keyof JobOffer, direction?: 'asc' | 'desc') {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection ==='asc' ? 'desc' : 'asc';
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
}
