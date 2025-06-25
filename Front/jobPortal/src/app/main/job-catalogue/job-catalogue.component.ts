import { Component, OnInit } from '@angular/core';
import { JobOffer } from 'src/app/model/jobOffer';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-job-catalogue',
  templateUrl: './job-catalogue.component.html',
  styleUrls: ['./job-catalogue.component.css'],
})
export class JobCatalogueComponent implements OnInit {
  jobOffers: JobOffer[] = [];
  gridCols: number = 3;

  constructor(
    private jobOfferService: JobOfferService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.jobOfferService.getJobOffers().subscribe((offers) => {
      this.jobOffers = offers;
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
}
