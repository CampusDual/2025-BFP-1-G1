import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOffer } from 'src/app/model/jobOffer';
import { UserData } from 'src/app/model/userData';
import { ApplicationService } from 'src/app/services/application.service';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { UsersService } from 'src/app/services/users.service';
import { filter, tap } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css'],
})
export class OfferDetailsComponent implements OnInit {
  offer!: JobOffer;
  userData: UserData | null = null;
  appliedOfferIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobOfferService,
    private applicationService: ApplicationService,
    private usersService: UsersService,
    public _snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Obtener datos del usuario (si está logueado)
    this.usersService.userData$.pipe(
      tap((data) => {
        if (!data && this.usersService.isLoggedIn()) {
          this.usersService.getUserData().subscribe();
        }
      }),
      filter((data) => data !== null)
    ).subscribe((data) => {
      this.userData = data;

      // Si es candidato, obtener las ofertas a las que ya aplicó
      if (this.isCandidate()) {
        this.applicationService.getUserApplications().subscribe({
          next: (applications: any[]) => {
            this.appliedOfferIds = applications.map((app: any) => app.offerId);
          },
          error: (err) => {
            console.error('Error al obtener aplicaciones del usuario:', err);
          }
        });
      }
    });

    // Obtener la oferta por ID
    if (id) {
      this.jobService.getJobOfferById(id).subscribe({
        next: (data: JobOffer) => {
          this.offer = data;
        },
        error: (err) => {
          console.error('Error al cargar la oferta:', err);
          this.router.navigate(['main/catalogue']);
        },
      });
    } else {
      this.router.navigate(['main/catalogue']);
    }
  }

  goBack(): void {
    this.location.back();
  }

  isCompany(): boolean {
    return (
      !!this.userData?.company ||
      (!!this.userData?.user && this.userData.user.role_id === 2)
    );
  }

  isCandidate(): boolean {
    return (
      !!this.userData?.candidate ||
      (!!this.userData?.user && this.userData.user.role_id === 3)
    );
  }

  isOfferOwner(): boolean {
    if (!this.userData?.user?.id || !this.offer?.company?.user?.id) {
      return false;
    }
    return this.userData.user.id === this.offer.company.user.id;
  }

  editOffer(): void {
    if (this.offer?.id) {
      this.router.navigate(['/company/offer-edit', this.offer.id]);
    }
  }
  openSnackBar(message: string, panelClass: string = '') {
    this._snackBar.open(message, 'Cerrar', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }

  aplicarAOferta(oferta: any) {
    this.applicationService.aplicarAOferta(oferta.id).subscribe({
      next: (res) => {
        this.openSnackBar(res, 'success');
        this.appliedOfferIds.push(oferta.id);
        this.appliedOfferIds = [...this.appliedOfferIds];
      },
      error: (err) => {
        let errorMessage =
          'Error al aplicar a la oferta. Inténtalo de nuevo más tarde.';
        if (err.status === 409) {
          errorMessage = err.error || 'Ya estás inscrito a esta oferta';
          if (!this.appliedOfferIds.includes(oferta.id)) {
            this.appliedOfferIds.push(oferta.id);
            this.appliedOfferIds = [...this.appliedOfferIds];
          }
        } else if (err.status === 401) {
          errorMessage =
            'No autorizado. Por favor, inicia sesión para aplicar.';
        }
        this.openSnackBar(errorMessage, 'error');
        console.error('Error applying to offer:', err);
      },
    });
  }
}
