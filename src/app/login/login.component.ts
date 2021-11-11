import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  loginForm!: FormGroup;
  loginError: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;
  showPassword: boolean = false;
  isBreeder: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.currentTokenValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.buildLoginForm();
  }

  get f() {
    return this.loginForm.controls;
  }

  buildLoginForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.authService
      .login(this.f.username.value, this.f.password.value)
      .subscribe(
        (response) => {
          const { status, message } = response;
          if (Object.keys(response).length === 0 || status === false) {
            if (!message) {
              this.loginError = true;
            } else {
              this.isBreeder = true;
            }
            this.loading = false;
            this.submitted = false;
            this.loginForm.reset();
            this.formGroupDirective.resetForm();
            return;
          }
          this.router.navigate(['/']);
        },
        (error) => {
          this.loading = false;
          this.submitted = false;
          this.loginError = true;
          this.loginForm.reset();
          this.formGroupDirective.resetForm();
        }
      );
  }
}
