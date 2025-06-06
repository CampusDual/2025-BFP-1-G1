import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.css']
})
export class LoginBoxComponent implements OnInit{
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    // Inicializa el FormGroup en ngOnInit
    this.loginForm = new FormGroup({
      // Define tus controles de formulario y sus validadores
      'username': new FormControl(null, Validators.required), // Campo 'username' con validador 'required'
      'password': new FormControl(null, Validators.required)  // Campo 'password' con validador 'required'
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }else{
      this.loginForm.markAllAsTouched();
    }
  }
}