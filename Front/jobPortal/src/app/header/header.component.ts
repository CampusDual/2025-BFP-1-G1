import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public usersService: UsersService, private router: Router) {}

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
