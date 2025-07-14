import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobOffer } from 'src/app/model/jobOffer';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'src/app/services/users.service';
import { UserData } from 'src/app/model/userData';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.css'],
})
export class CreateOfferComponent implements OnInit {
  @Input() jobToEdit: JobOffer | null = null;

  offerForm!: FormGroup;
  userData: UserData | null = null;
  modalidad = ['presencial', 'remoto', 'hibrido'];


  constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    private jobOfferService: JobOfferService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.offerForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.required, Validators.maxLength(4000)]],
      localizacion: [''],
      modalidad: ['', Validators.required],
      requisitos: [''],
      deseables: [''],
      beneficios: [''],
      releaseDate: [new Date()],
      company: [null, Validators.required],
      email: [''],
    });
  }

  ngOnInit(): void {
    this.userService.userData$.subscribe((data) => {
      this.userData = data;
      if (data?.company) {
        this.offerForm.patchValue({
          company: data.company,
          email: data.user.email,
        });
      }
    });

    if (!this.userData) {
      this.userService.getUserData().subscribe();
    }
  }


  onSubmit(): void {
    if (this.offerForm.valid) {
      const newOffer: JobOffer = this.offerForm.value;
      newOffer.releaseDate = new Date(newOffer.releaseDate);

      this.jobOfferService.addJobOffers(newOffer).subscribe({
        next: () => {
          this.snackBar.open('Oferta publicada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: 'successSnackbar',
            verticalPosition: 'top',
          });
          this.offerForm.reset();
          this.router.navigate(['/main/userprofile']);
        },
        error: () => {
          this.snackBar.open('Error al crear la oferta', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        },
      });
    } else {
      this.offerForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/main/userprofile']);
  }
}
