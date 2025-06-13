import { Component, OnInit } from '@angular/core';
import { JobOffer } from 'src/app/model/jobOffer';
import { JobOfferService } from 'src/app/services/job-offer.service';

@Component({
  selector: 'app-job-catalogue',
  templateUrl: './job-catalogue.component.html',
  styleUrls: ['./job-catalogue.component.css']
})
export class JobCatalogueComponent implements OnInit {
  jobOffers: JobOffer[] = [];

  constructor(private jobOfferService: JobOfferService) {}

  ngOnInit(): void {
    this.jobOfferService.getJobOffers().subscribe((offers) => {
      this.jobOffers = offers;
    });
  }
}