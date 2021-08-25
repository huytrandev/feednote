import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.currentUserValue) {
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
      .subscribe((respose) => {
        if (Object.keys(respose).length === 0 || respose.status === false) {
          this.loading = false;
          this.submitted = false;
          this.loginError = true;
          this.loginForm.reset();
          return;
        }

        this.router.navigate(['/']);
      });
  }
}
