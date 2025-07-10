import { CompanyService } from './../../services/company.service';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from 'src/app/model/userData';
import { UsersService } from 'src/app/services/users.service';
import { Company } from 'src/app/model/company';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private usersService: UsersService,
    private companyService: CompanyService,
    private router: Router,
    private snackbar: MatSnackBar
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
      panelClass: [panelClass],
    });
  }
  onDeleteCompany(companyId: number): void {
    this.usersService.getJobOffersCount(companyId).subscribe({
      next: (count) => {
        if (count > 0) {
          this.openSnackbar(
            `No se puede eliminar la empresa porque tiene ${count} oferta(s) de trabajo asociada(s).`,
            'error-snackbar'
          );
        } else {
          if (
            confirm(
              'Esta empresa no tiene ofertas de trabajo. ¿Estás seguro de que quieres eliminarla?'
            )
          ) {
            this.usersService.deleteCompany(companyId).subscribe({
              next: () => {
                this.openSnackbar('Empresa eliminada correctamente.');
              },
              error: (err) => {
                console.error('Error al eliminar la empresa:', err);
                this.openSnackbar(
                  'Ocurrió un error al eliminar la empresa.',
                  'error-snackbar'
                );
              },
            });
          }
        }
      },
      error: (err) => {
        console.error('Error al comprobar las ofertas:', err);
        this.openSnackbar(
          'Ocurrió un error al comprobar si la empresa tenía ofertas.',
          'error-snackbar'
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
}
