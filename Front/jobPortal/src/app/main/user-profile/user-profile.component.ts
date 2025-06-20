import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})

export class UserProfileComponent implements OnInit {
  user: User | null = null;



  constructor(
    private usersService: UsersService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.usersService.getUserProfile().subscribe({
      next: (data) => (this.user = data),
      error: (err) => {
        console.error('No se pudo obtener el usuario', err);
      },
    });
  }

  moveToCreateOffer(): void {
    this.router.navigate(['/main/createOffer']);
  }

}
