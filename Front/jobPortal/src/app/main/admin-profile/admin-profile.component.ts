import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from 'src/app/model/userData';
import { UsersService } from 'src/app/services/users.service';
import { Company } from 'src/app/model/company';
import { CompanyService } from './../../services/company.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';
import { Subject, forkJoin } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
})
export class AdminProfileComponent implements OnInit, OnDestroy {
  userData: UserData | null = null;
  isMobile = false;
  company: Company | null = null;
  companies: Company[] = [];
  editMode: { [id: number]: boolean } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private usersService: UsersService,
    private companyService: CompanyService,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private loadingScreenService: LoadingScreenService
  ) {}

  ngOnInit(): void {
    this.checkIfMobile();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.loadingScreenService.show();

    forkJoin({
      userData: this.usersService.getUserData(),
      allCompanies: this.companyService.getAllCompanies(),
    })
      .pipe(
        finalize(() => this.loadingScreenService.hide()),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (results) => {
          this.userData = results.userData;
          this.companies = results.allCompanies;
          console.log('User Data:', this.userData);
          console.log('All Companies:', this.companies);

          if (!this.isAdmin()) {
            console.warn('Acceso denegado: el usuario no es administrador.');
            this.router.navigate(['/main/catalogue']);
            this.openSnackbar(
              'Acceso denegado. No tienes permisos de administrador.',
              'errorSnackbar'
            );
          }
        },
        error: (err) => {
          console.error(
            'Error al cargar los datos iniciales del administrador:',
            err
          );
          this.openSnackbar(
            'Error al cargar los datos iniciales.',
            'errorSnackbar'
          );
          if (err.status === 401 || err.status === 403) {
            this.router.navigate(['/auth/login']);
            this.openSnackbar(
              'Sesión expirada o acceso denegado. Por favor, inicie sesión de nuevo.',
              'errorSnackbar'
            );
          } else {
            this.router.navigate(['/main/catalogue']);
          }
        },
      });
  }

  @HostListener('window:resize')
  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  navigateToFormNewCompany() {
    this.router.navigate(['/main/companysignup']);
  }

  openSnackbar(message: string, panelClass: string = '') {
    this.snackbar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: panelClass ? [panelClass] : undefined,
    });
  }

  onDeleteCompany(companyId: number): void {
    this.usersService
      .getJobOffersCount(companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (count) => {
          if (count > 0) {
            this.openSnackbar(
              `No se puede eliminar la empresa porque tiene ${count} oferta(s) de trabajo asociada(s).`,
              'errorSnackbar'
            );
          } else {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              width: '350px',
              data: {
                title: 'Eliminar empresa',
                message: '¿Estás seguro de que deseas eliminar la empresa?',
              },
            });

            dialogRef.afterClosed().subscribe((result: boolean) => {
              if (result) {
                this.usersService
                  .deleteCompany(companyId)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe({
                    next: () => {
                      this.openSnackbar(
                        'Empresa eliminada correctamente.',
                        'successSnackbar'
                      );
                      this.companies = this.companies.filter(
                        (company) => company.id !== companyId
                      );
                      this.cdRef.detectChanges();
                    },
                    error: (err) => {
                      console.error('Error al eliminar la empresa:', err);
                      this.openSnackbar(
                        'Error al eliminar la empresa.',
                        'errorSnackbar'
                      );
                    },
                  });
              }
            });
          }
        },
        error: (err) => {
          console.error('Error al comprobar las ofertas:', err);
          this.openSnackbar(
            'Ocurrió un error al comprobar si la empresa tenía ofertas.',
            'errorSnackbar'
          );
        },
      });
  }

  isAdmin(): boolean {
    return (
      !!this.userData?.company ||
      (!!this.userData?.user && this.userData.user.role_id === 1)
    );
  }

  startEdition(id: number): void {
    this.editMode[id] = true;
  }

  cancelEdition(id: number): void {
    this.editMode[id] = false;
    this.companyService
      .getAllCompanies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.companies = data;
        },
        error: (error) => {
          console.error(
            'Error al recargar empresas después de cancelar edición:',
            error
          );
          this.openSnackbar('Error al recargar empresas.', 'errorSnackbar');
        },
      });
  }

  saveChanges(company: Company): void {
    this.companyService
      .updateCompany(company.id!, company)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadingScreenService.hideQuick();
          this.editMode[company.id!] = false;
          this.loadInitialData();
          this.openSnackbar(
            'Empresa actualizada correctamente.',
            'successSnackbar'
          );
        },

        error: (err) => {
          console.error('Error al actualizar la empresa:', err);
          this.openSnackbar('Error al actualizar la empresa.', 'errorSnackbar');
        },
      });
  }
}
