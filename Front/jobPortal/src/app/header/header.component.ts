import { UserData } from './../model/userData';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userData: UserData | null = null;

  constructor(public usersService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.usersService.userData$.subscribe((userData) => {
      this.userData = userData;
    });
    if (!this.userData && this.usersService.isLoggedIn()) {
      this.usersService.getUserData().subscribe();
    }
  }

  goToCatalogue(): void {
    this.router.navigate(['/main/catalogue']);
  }

  goToRegister(): void {
    this.router.navigate(['/main/signup']);
  }

  redirectToProfile(): void {
    if (!this.usersService.isLoggedIn()) {
      this.router.navigate(['/main/login']);
      return;
    }

    if (this.isCandidate()) {
      this.router.navigate(['/main/candidateprofile']);
    } else if (this.isCompany()) {
      this.router.navigate(['/main/userprofile']);
    } else if (this.isAdmin()) {
      this.router.navigate(['/main/adminprofile']);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/main/login']);
  }

  logout(): void {
    this.usersService.logout();
    this.router.navigate(['/main/login']);
  }

  getDisplayName(): string {
    if (this.userData?.candidate) {
      return `${this.userData.candidate.name} ${this.userData.candidate.surname}`;
    } else if (this.userData?.company) {
      return this.userData.company.name;
    } else if (this.userData?.admin) {
      return this.userData.user.login;
    } else if (this.userData?.user) {
      return this.userData.user.login;
    }
    return '';
  }
  navigateToProfile() {
    if (this.userData?.candidate) {
      this.router.navigate(['/main/candidateprofile']);
    } else if (this.userData?.company) {
      this.router.navigate(['/main/userprofile']);
    } else if (this.userData?.admin) {
      this.router.navigate(['/main/adminprofile']);
    }
  }

  isCandidate(): boolean {
    return (
      !!this.userData?.candidate ||
      (!!this.userData?.user && this.userData.user.role_id === 3)
    );
  }

  isCompany(): boolean {
    return (
      !!this.userData?.company ||
      (!!this.userData?.user && this.userData.user.role_id === 2)
    );
  }
  isAdmin(): boolean {
    return (
      !!this.userData?.company ||
      (!!this.userData?.user && this.userData.user.role_id === 1)
    );
  }
}
