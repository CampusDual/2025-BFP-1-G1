import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-company-signup',
  templateUrl: './company-signup.component.html',
  styleUrls: ['./company-signup.component.css'],
})
export class CompanySignupComponent {
  signUpForm!: FormGroup;
  isSubmitting = false;

  tooltipX = 0;
  tooltipY = 0;
  showTooltip = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signUpForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', [Validators.required]],
      cif: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[0-9A-J]$/),
        ],
      ],
      address: ['', [Validators.required]],
      web: ['', [Validators.required, Validators.pattern('https?://.+')]],
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
  get web() {
    return this.signUpForm.get('web');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get phone() {
    return this.signUpForm.get('phone');
  }
  get cif() {
    return this.signUpForm.get('cif');
  }
  get address() {
    return this.signUpForm.get('address');
  }
  openSnackBar(message: string, panelClass: string = '') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }

  companySignUp() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    if (this.signUpForm.valid) {
      const { login, password, name, web, email, phone, address, cif } =
        this.signUpForm.value;

      this.usersService
        .insertNewCompany(
          login,
          password,
          name,
          cif,
          email,
          phone,
          web,
          address
        )
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.openSnackBar('Registro exitoso!', 'success-snackbar');
            this.router.navigate(['/main/adminprofile']);
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Registro fallido:', error);

            let errorMessage = 'Error desconocido en el registro';

            if (error.status === 0) {
              errorMessage =
                'Error de conexión. Por favor, verifica tu conexión a internet.';
            } else if (error.status === 409) {
              if (error.error) {
                if (typeof error.error === 'string') {
                  errorMessage = error.error;
                } else if (error.error.message) {
                  errorMessage = error.error.message;
                }
              }

              const lowerCaseMessage = errorMessage.toLowerCase();
              if (
                lowerCaseMessage.includes('usuario ya existe') ||
                lowerCaseMessage.includes('user already exists') ||
                lowerCaseMessage.includes('duplicate username')
              ) {
                const loginControl = this.signUpForm.get('login');
                loginControl?.setErrors({ loginExists: true });
                loginControl?.markAsTouched();
                errorMessage = 'El nombre de usuario ya está en uso';
              } else if (
                lowerCaseMessage.includes('email ya existe') ||
                lowerCaseMessage.includes('email already exists') ||
                lowerCaseMessage.includes('duplicate email')
              ) {
                const emailControl = this.signUpForm.get('email');
                emailControl?.setErrors({ emailExists: true });
                emailControl?.markAsTouched();
                errorMessage = 'El correo electrónico ya está en uso';
              }
            } else if (error.status === 400) {
              if (error.error && error.error.message) {
                errorMessage = error.error.message;
              } else {
                errorMessage = 'Datos de registro inválidos';
              }
            } else if (error.status === 401) {
              errorMessage = 'No autorizado. Por favor, inténtalo de nuevo.';
            } else if (error.message) {
              errorMessage = error.message;
            }

            this.openSnackBar(errorMessage, 'error-snackbar');
          },
        });
    } else {
      this.isSubmitting = false;
      this.signUpForm.markAllAsTouched();
      this.openSnackBar(
        'Por favor, complete todos los campos correctamente',
        'error-snackbar'
      );
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

  onMouseMove(event: MouseEvent): void {
    const offset = 15;
    this.tooltipX = event.clientX;
    this.tooltipY = event.clientY + offset;
  }
}
