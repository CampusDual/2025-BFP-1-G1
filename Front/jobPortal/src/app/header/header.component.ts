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
    // Suscríbete al observable user$
    this.usersService.userData$.subscribe((userData) => {
      this.userData = userData;
    });

    // Si no hay usuario cargado pero hay token, pide el perfil
    if (!this.userData?.user && this.usersService.isLoggedIn()) {
      this.usersService.getUserData().subscribe();
    }
  }

  goToCatalogue(): void {
    this.router.navigate(['/main/catalogue']);
  }

  redirectToProfile(): void {
    if (this.usersService.isLoggedIn()) {
      this.router.navigate(['/main/userprofile']);
    } else {
      this.router.navigate(['/main/login']);
    }
  }
  goToLogin(): void {
    this.router.navigate(['/main/login']);
  }

  logout(): void {
    this.usersService.logout();
    this.router.navigate(['/main/login']);
  }
}
