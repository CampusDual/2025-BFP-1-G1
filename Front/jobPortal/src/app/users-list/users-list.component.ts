import { UsersService } from './../services/users.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent {
  users!: User[];
  constructor(private UsersService: UsersService) {}

  login() {
    this.UsersService.login('username', 'password').subscribe({
      next: (response) => {
        console.log('Login successful:', response);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}
