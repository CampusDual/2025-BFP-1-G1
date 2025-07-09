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
  modalidadesTrabajo = ['Presencial', 'Remoto', 'Hibrido'];
  isEditing = false;

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
      modalidadTrabajo: ['', Validators.required],
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

      if (this.jobToEdit) {
        this.startEditing(this.jobToEdit);
      }
    });

    if (!this.userData) {
      this.userService.getUserData().subscribe();
    }
  }

  startEditing(offer: JobOffer): void {
    this.isEditing = true;
    this.offerForm.patchValue({
      ...offer,
      releaseDate: new Date(offer.releaseDate),
    });
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.offerForm.reset();
    this.router.navigate(['/main/userprofile']);
  }

  updateCurrentItem(): void {
    if (this.offerForm.valid && this.jobToEdit) {
      const updatedOffer: JobOffer = {
        ...this.jobToEdit,
        ...this.offerForm.value,
        releaseDate: new Date(this.offerForm.value.releaseDate),
      };

      this.jobOfferService.updateJobOffer(updatedOffer).subscribe({
        next: () => {
          this.snackBar.open('Oferta actualizada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: 'successSnackbar',
            verticalPosition: 'top',
          });
          this.isEditing = false;
          this.router.navigate(['/main/userprofile']);
        },
        error: () => {
          this.snackBar.open('Error al actualizar la oferta', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        },
      });
    } else {
      this.offerForm.markAllAsTouched();
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
