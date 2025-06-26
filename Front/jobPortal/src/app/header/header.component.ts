import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { User } from '../model/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   user: User | null = null;

  constructor(public usersService: UsersService, private router: Router) {}

  ngOnInit(): void {
    // Suscríbete al observable user$
    this.usersService.user$.subscribe(user => {
      this.user = user;
    });

    // Si no hay usuario cargado pero hay token, pide el perfil
    if (!this.user && this.usersService.isLoggedIn()) {
      this.usersService.getUserProfile().subscribe();
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

//  goToRegister(): void {
//  this.router.navigate(['/main/register']);
//  }

  logout(): void {
    this.usersService.logout(); 
    this.router.navigate(['/main/login']);
  }
}
