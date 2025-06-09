import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  element!: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      let name = params['name'];
      console.log('Nombre del usuario:', name);
      if (name) {
        this.usersService.getUserProfile(name).subscribe((user) => {
          this.element = user;
        });
      }
    });
  }
}
