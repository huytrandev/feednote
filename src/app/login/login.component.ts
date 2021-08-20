import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildLoginForm(); 
  }

  get f() {
    return this.loginForm.controls;
  }

  buildLoginForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  submit(): void {
    if (this.loginForm.invalid) return;

    console.log(this.loginForm.value);
    this.loginForm.reset();
  }
}
