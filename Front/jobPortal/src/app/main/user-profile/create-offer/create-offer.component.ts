import { Component, OnInit } from '@angular/core';
import { JobOffer } from 'src/app/model/jobOffer';
import { User } from 'src/app/model/user';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.css']
})
export class CreateOfferComponent implements OnInit {
  user: User | null = null;

  offerForm!: FormGroup;
  jobOffers!: JobOffer;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder, 
    private jobOfferService: JobOfferService,
    private router: Router
  ) {

    this.offerForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.usersService.user$.subscribe(user => {
      this.user = user;
    });

    if (!this.user) {
      this.usersService.getUserProfile().subscribe();
    }

  }

  onSubmit(): void {
    const publishMessage = document.getElementById("published");
    if (this.offerForm.valid && this.user) {
      const newOffer: JobOffer = {
        title: this.offerForm.value.title,
        description: this.offerForm.value.description,
        user_id: this.user.id,
        email: this.user.email,
        companyName: this.user.name
            };

      this.jobOfferService.addJobOffers(newOffer).subscribe({
        next: (response) => {
          console.log('Oferta creada con éxito: ', response);
          if(publishMessage){
            setTimeout(() => {
            publishMessage.style.visibility = 'visible';},10000);
          }
          this.offerForm.reset();
        },
        error: (error) => {
          console.error('Error al crear la oferta: ', error);
        }
      });

    } else {
      console.log('Formulario no válido o usuario no cargado.')
    }
  }

  goCatalogue(): void {
    this.router.navigate(['/main/catalogue']);
  }



}

