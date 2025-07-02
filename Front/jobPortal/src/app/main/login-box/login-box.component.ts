import { UsersService } from '../../services/users.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.css'],
})
export class LoginBoxComponent {
  loginForm: FormGroup;

  get password() {
    return this.loginForm.get('password');
  }
  get username() {
    return this.loginForm.get('username');
  }

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
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

          localStorage.setItem('token', response.token);
          this.router.navigate(['/main/userprofile']);
        },
        error: (error) => {
          console.error('Login fallido:', error);
          this.snackBar.open('Inicio de sesión incorrecto', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
          if (errorMessage) {
            errorMessage.style.visibility = 'visible';
          }
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      console.warn(
        'Formulario inválido. No se puede enviar la petición de login.'
      );

      if (errorMessage) {
        errorMessage.style.visibility = 'visible';
      }
    }
  }
  getFieldErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    return '';
  }
}
