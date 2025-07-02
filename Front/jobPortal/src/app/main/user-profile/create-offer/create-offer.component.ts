import { Component, OnInit } from '@angular/core';
import { JobOffer } from 'src/app/model/jobOffer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyService } from 'src/app/services/company.service';
import { Company } from 'src/app/model/company';
import { UsersService } from 'src/app/services/users.service';
import { UserData } from 'src/app/model/userData';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.css'],
})
export class CreateOfferComponent implements OnInit {
  userData: UserData | null = null;
  offerForm!: FormGroup;

  // Contadores
  titleCharCount = 0;
  descCharCount = 0;
  maxTitleChars = 120;
  maxDescChars = 4000;

  constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    private jobOfferService: JobOfferService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.offerForm = this.fb.group({
      title: [
        '',
        [Validators.required, Validators.maxLength(this.maxTitleChars)],
      ],
      description: [
        '',
        [Validators.required, Validators.maxLength(this.maxDescChars)],
      ],
    });
  }

  ngOnInit(): void {
    this.userService.userData$.subscribe((userData) => {
      this.userData = userData;
    });

    if (!this.userData) {
      this.userService.getUserData().subscribe();
    }

    // Actualizar contadores
    this.offerForm.get('title')?.valueChanges.subscribe((val) => {
      this.titleCharCount = val?.length || 0;
    });

    this.offerForm.get('description')?.valueChanges.subscribe((val) => {
      this.descCharCount = val?.length || 0;
    });
  }

  get title() {
    return this.offerForm.get('title');
  }

  get description() {
    return this.offerForm.get('description');
  }

  onSubmit(): void {
    if (this.offerForm.valid && this.userData) {
      const newOffer: JobOffer = {
        title: this.offerForm.value.title,
        description: this.offerForm.value.description,
        company: this.userData.company,
        email: this.userData.user.email,
        releaseDate: new Date(),
      };

      this.jobOfferService.addJobOffers(newOffer).subscribe({
        next: (response) => {
          this.snackBar.open('Oferta publicada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: 'successSnackbar',
            verticalPosition: 'top',
          });
          this.offerForm.reset();
          this.titleCharCount = 0;
          this.descCharCount = 0;
        },
        error: (error) => {
          console.error('Error al crear la oferta: ', error);
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

  goCatalogue(): void {
    this.router.navigate(['/main/catalogue']);
  }

  goBack(): void {
    this.router.navigate(['/main/userprofile']);
  }

  getFieldErrorMessage(controlName: string): string {
    const control = this.offerForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('maxlength')) {
      return controlName === 'title'
        ? `Título demasiado largo (máx. ${this.maxTitleChars} caracteres)`
        : `Descripción demasiado larga (máx. ${this.maxDescChars} caracteres)`;
    }
    return '';
  }
}
