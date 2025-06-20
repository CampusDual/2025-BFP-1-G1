import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobOffer } from 'src/app/model/jobOffer';
import { User } from 'src/app/model/user';
import { UsersService } from 'src/app/services/users.service';
import { JobOfferService } from 'src/app/services/job-offer.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})

export class UserProfileComponent implements OnInit {
  jobOffers!:JobOffer[];
  user: User | null = null;

  constructor(
    private usersService: UsersService,
    private jobOfferService: JobOfferService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.usersService.getUserProfile().subscribe({
      next: (data) => (this.user = data),
      error: (err) => {
        console.error('No se pudo obtener el usuario', err);
      },
    });

    this.jobOfferService.getProfileOffers().subscribe({
      next: (offers) => (this.jobOffers = offers),
      error: (err) => {
        console.error('No se pudieron obtener las ofertas', err);
      },
    });
  }

  moveToCreateOffer(): void {
    this.router.navigate(['/main/createOffer']);
  }
}