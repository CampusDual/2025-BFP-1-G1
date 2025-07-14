import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOfferService } from '../../services/job-offer.service';
import { JobOffer } from '../../model/jobOffer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.css']
})
export class EditOfferComponent implements OnInit {
  offerForm: FormGroup;
  offerId: number = 0;
  isSubmitting = false;
  jobOfferId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobOfferService: JobOfferService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private location: Location
  ) {
    this.offerForm = this.createForm();
  }

  ngOnInit(): void {
    this.offerId = +this.route.snapshot.paramMap.get('id')!;
    this.loadOfferData();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.required, Validators.maxLength(4000)]],
      localizacion: ['', Validators.required],
      modalidad: ['', Validators.required],
      requisitos: ['', Validators.required],
      deseables: [''],
      beneficios: ['', Validators.required],
      company: this.fb.group({
        name: [''],
        logo: [''],
        web: ['']
      })
    });
  }

  loadOfferData(): void {
    this.jobOfferService.getJobOfferById(this.offerId).subscribe({
      next: (offer) => {
        this.offerForm.patchValue({
          title: offer.title,
          description: offer.description,
          localizacion: offer.localizacion,
          modalidad: offer.modalidad,
          requisitos: offer.requisitos,
          deseables: offer.deseables,
          beneficios: offer.beneficios,
          company: {
            name: offer.company?.name,
            logo: offer.company?.logo,
            web: offer.company?.web
          }
        });
      },
      error: (err) => {
        this.showError('Error al cargar la oferta');
        this.router.navigate(['/main/jobOffers']);
      }
    });
  }

  onSubmit(): void {
    if (this.offerForm.valid) {
      this.isSubmitting = true;
      const updatedOffer: JobOffer = {
        ...this.offerForm.value,
        id: this.offerId
      };

      this.jobOfferService.updateJobOffer(this.offerId, updatedOffer).subscribe({
        next: () => {
          this.showSuccess('Oferta actualizada correctamente');
          this.router.navigate(['/main/jobOffers']);
        },
        error: (err) => {
          this.showError('Error al actualizar la oferta');
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.location.back();
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  // Métodos de ayuda para el template
  get title() { return this.offerForm.get('title'); }
  get description() { return this.offerForm.get('description'); }
  get localizacion() { return this.offerForm.get('localizacion'); }
  get modalidad() { return this.offerForm.get('modalidad'); }
  get requisitos() { return this.offerForm.get('requisitos'); }
  get beneficios() { return this.offerForm.get('beneficios'); }
  get company() { return this.offerForm.get('company'); }


}