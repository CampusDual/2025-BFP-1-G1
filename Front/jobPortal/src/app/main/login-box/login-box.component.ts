import { UsersService } from '../../services/users.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.css'],
})
export class LoginBoxComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private usersService: UsersService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    const errorMessage = document.getElementById('error');
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      console.log('intentando loguearme como: ', { username, password });

      this.usersService.login(username, password).subscribe({
        next: (response) => {
          console.log('Login correcto:', response);
          this.router.navigate(['/main/userprofile/:name']);
        },
        error: (error) => {
          console.error('Login fallido:', error);
          if (errorMessage){
            errorMessage.style.visibility = 'visible';
          }
        },
      });
    } else {
      console.warn(
        'Formulario inválido. No se puede enviar la petición de login.'
      );
      alert('Por favor, ingresa tu usuario y contraseña.');
    }
  }


}
