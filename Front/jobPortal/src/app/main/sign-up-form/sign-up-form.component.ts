import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css'],
})
export class SignUpFormComponent {
  signUpForm!: FormGroup;
  get login() {
    return this.signUpForm.get('login');
  }
  get password() {
    return this.signUpForm.get('password');
  }
  get name() {
    return this.signUpForm.get('name');
  }
  get surname() {
    return this.signUpForm.get('surname');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get phone() {
    return this.signUpForm.get('phone');
  }

  /* constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signUp() {
    const errorMessage = document.getElementById('error');
    if (this.signUpForm.valid) {
      const username = this.signUpForm.value.username;
      const password = this.signUpForm.value.password;
      this.usersService.login(username, password).subscribe({
        next: (response) => {
          console.log('Login correcto:', response);

          localStorage.setItem('token', response.token);
          this.router.navigate(['/main/userprofile', { username }]);
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
    const control = this.signUpForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    return '';
  }*/
}
