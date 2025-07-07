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
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signUpForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    });
  }

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

  openSnackBar(message: string, panelClass: string = '') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }

  signUp() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    if (this.signUpForm.valid) {
      const { login, password, name, surname, email, phone } = this.signUpForm.value;

      this.usersService
        .signUpCandidate(login, password, name, surname, email, phone)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.openSnackBar('Registro exitoso!', 'success-snackbar');
            this.router.navigate(['/main/login']);
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Registro fallido:', error);

            const errorMessage = typeof error?.error === 'string'
              ? error.error.toLowerCase()
              : (error?.error?.message?.toLowerCase() || '');

            if (errorMessage.includes('usuario ya existe') || errorMessage.includes('user already exists')) {
              const loginControl = this.signUpForm.get('login');
              loginControl?.setErrors({ loginExists: true });
              loginControl?.markAsTouched();
            }

            if (errorMessage.includes('email ya existe') || errorMessage.includes('email already exists')) {
              const emailControl = this.signUpForm.get('email');
              emailControl?.setErrors({ emailExists: true });
              emailControl?.markAsTouched();
            }

            this.openSnackBar(
              'Error en el registro: ' + (errorMessage || 'Por favor revise los campos'),
              'error-snackbar'
            );
          },
        });
    } else {
      this.isSubmitting = false;
      this.signUpForm.markAllAsTouched();
      this.openSnackBar('Por favor, complete todos los campos correctamente', 'error-snackbar');
    }
  }

  getFieldErrorMessage(controlName: string): string {
    const control = this.signUpForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (controlName === 'login' && control?.hasError('loginExists')) {
      return 'Este usuario ya está registrado';
    }
    if (controlName === 'email' && control?.hasError('emailExists')) {
      return 'Este email ya está registrado';
    }
    if (controlName === 'email' && control?.hasError('email')) {
      return 'Formato de mail no válido';
    }
    if (controlName === 'phone' && control?.hasError('pattern')) {
      return 'Teléfono debe tener 9 dígitos';
    }

    return '';
  }
}
