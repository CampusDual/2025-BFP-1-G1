import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';



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

  // get birthdate() {
  //   return this.signUpForm.get('birthdate');
  // }

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signUpForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      // birthdate: ['', Validators.required, Validators.pattern('^(19|20)\\d\\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$')],
    });
  }

  signUp() {
    const errorMessage = document.getElementById('error');
    if (this.signUpForm.valid) {
      const login = this.signUpForm.value.login;
      const password = this.signUpForm.value.password;
      const name = this.signUpForm.value.name;
      const surname = this.signUpForm.value.surname;
      const email = this.signUpForm.value.email;
      const phone = this.signUpForm.value.phone;
      // const birthdate = this.signUpForm.value.birthdate;

      this.usersService.signUpCandidate(login, password, name, surname, email, phone).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          this.router.navigate(['/main/login']);
        },
        error: (error) => {
          console.error('Registro fallido:', error);
          this.snackBar.open('Registro fallido', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
          if (errorMessage) {
            errorMessage.style.visibility = 'visible';
          }
        },
      });
    } else {
      this.signUpForm.markAllAsTouched();
      console.warn(
        'Formulario inválido. No se puede enviar la petición de registro.'
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
  }
}
