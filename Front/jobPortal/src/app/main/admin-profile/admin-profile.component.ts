import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from 'src/app/model/userData';
import { UsersService } from 'src/app/services/users.service';
import { Company } from 'src/app/model/company';
import { CompanyService } from './../../services/company.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
})
export class AdminProfileComponent {
  userData: UserData | null = null;
  isMobile = false;
  company: Company | null = null;
  companies: Company[] = [];
  editMode: { [id: number]: boolean } = {};

  constructor(
    private usersService: UsersService,
    private companyService: CompanyService,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkIfMobile();
    this.loadUserData();
    this.loadAllCompanies();
  }

  private loadUserData(): void {
    this.usersService.getUserData().subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (err) => {
        console.error('No se pudo obtener el usuario', err);
        this.router.navigate(['/main/catalogue']);
      },
    });
  }

  private loadAllCompanies(): void {
    this.companyService.getAllCompanies().subscribe({
      next: (data) => {
        this.companies = data;
        console.log('All Companies:', this.companies);
      },
      error: (error) => {
        console.error('Error loading all companies:', error);
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
    this.usersService.getJobOffersCount(companyId).subscribe({

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
              this.usersService.deleteCompany(companyId).subscribe({
                next: () => {
                  this.openSnackbar('Empresa eliminada correctamente.', 'successSnackbar');
                  this.companies = this.companies.filter(
                    (company) => company.id !== companyId
                  );
                  this.cdRef.detectChanges();
                },
                error: (err) => {
                  console.error('Error al eliminar la empresa:', err);
                  this.openSnackbar('Error al eliminar la empresa.', 'errorSnackbar');
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
    this.loadAllCompanies();
  }

  saveChanges(company: Company): void {
    this.companyService.updateCompany(company.id, company).subscribe({
      next: () => {
        this.editMode[company.id] = false;
        this.loadAllCompanies();
        this.openSnackbar('Empresa actualizada correctamente.', 'successSnackbar');
      },
      error: (err) => {
        this.openSnackbar('Error al actualizar la empresa.', 'errorSnackbar');
      }
    });
  }
}
