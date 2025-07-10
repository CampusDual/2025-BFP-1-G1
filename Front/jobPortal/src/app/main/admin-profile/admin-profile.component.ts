import { CompanyService } from './../../services/company.service';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from 'src/app/model/userData';
import { UsersService } from 'src/app/services/users.service';
import { MatTableModule } from '@angular/material/table';
import { Company } from 'src/app/model/company';

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
    private router: Router
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
  deleteCompany(companyId: number): void {
    if (!companyId) {
      console.error('ID de la empresa no válido');
      return;
    }
    const confirmation = confirm(
      '¿Estás seguro de que quieres eliminar esta empresa? Esta acción no se puede deshacer.'
    );

    if (confirmation) {
      this.usersService.deleteCompany(companyId).subscribe({
        next: (response) => {
          console.log('Empresa eliminada con éxito', response);
          this.companies = this.companies.filter(
            (company) => company.id !== companyId
          );
        },
        error: (err) => {
          console.error('Error al eliminar la empresa:', err);
          alert(
            err.message || 'Ocurrió un error al intentar eliminar la empresa.'
          );
        },
      });
    }
  }

  isAdmin(): boolean {
    return (
      !!this.userData?.company ||
      (!!this.userData?.user && this.userData.user.role_id === 1)
    );
  }
}
