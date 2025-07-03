import { UsersService } from '../../services/users.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserData } from 'src/app/model/userData';

@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.css'],
})
export class LoginBoxComponent {
  loginForm: FormGroup;
  role: string | null = null;

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
          this.role = localStorage.getItem('role');
          if (this.role === '3') {
            this.router.navigate(['/main/catalogue']);
          } else if (this.role === '2') {
            this.router.navigate(['/main/userprofile']);
          } else {
            this.router.navigate(['/main/catalogue']);
          }
        },
        error: (error) => {
          console.error('No se pudo obtener el usuario', error);
          this.snackBar.open('No se pudo obtener el usuario', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        },
      });
    } else {
      this.snackBar.open('Inicio de sesión incorrecto', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
      });
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
