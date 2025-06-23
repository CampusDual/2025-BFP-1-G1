import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private usersService: UsersService, private router: Router) { }

  redirectToProfile(): void {
    if (this.usersService.isLoggedIn()) {
      this.router.navigate(['/main/userprofile']);
    } else {
      this.router.navigate(['/main/login']);
    }
  }
  
}