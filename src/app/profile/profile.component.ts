import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MustMatch } from '../helpers/must-match.validator';

const USER = {
  username: 'hyouwhy',
  name: 'Huy Tran',
  role: 'administrator',
  phone: '0865791317',
  mail: 'tranthanhhuy2207@gmail.com',
  address: 'Binh Minh, Vinh Long',
  createAt: '2020-12-10T18:49:04.000Z',
};

interface UserDto {
  username: string;
  name: string;
  role: string;
  phone: string;
  mail: string;
  address: string;
  createdAt: Date;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  changePasswordForm!: FormGroup;

  name!: FormControl;

  addresses!: any;
  user!: UserDto;
  validationType: any = {
    name: [Validators.required, Validators.minLength(3)],
    phone: [
      Validators.required,
      Validators.pattern(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
    ],
    mail: [Validators.required, Validators.email],
    address: [Validators.required],
    currentPassword: [Validators.required, Validators.minLength(6)],
    newPassword: [Validators.required],
    confirmPassword: [Validators.required],
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getUser();
    this.buildForm();
    this.buildChangePasswordForm();
  }

  getUser(): void {
    const createdAt = new Date(USER.createAt);
    this.user = { ...USER, createdAt: createdAt };
  }

  get f() {
    return this.form.controls;
  }

  get f2() {
    return this.changePasswordForm.controls;
  }

  removeValidators(form: FormGroup): void {
    for (const key in form.controls) {
      form.get(key)?.clearValidators();
      form.get(key)?.updateValueAndValidity();
    }
  }

  addValidators(form: FormGroup): void {
    for (const key in form.controls) {
      form.get(key)?.setValidators(this.validationType[key]);
      form.get(key)?.updateValueAndValidity();
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: [this.user.name, [Validators.required, Validators.minLength(3)]],
      phone: [
        this.user.phone,
        [
          Validators.required,
          Validators.pattern(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
        ],
      ],
      mail: [this.user.mail, [Validators.required, Validators.email]],
      address: [this.user.address, [Validators.required]],
    });
  }

  buildChangePasswordForm(): void {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: MustMatch('newPassword', 'confirmPassword'),
      }
    );
  }

  submit(): void {
    if (!this.form.valid) return;

    console.log(this.form.value);
    this.buildForm();
    this.removeValidators(this.form);
    this.addValidators(this.form);
  }

  changePassword(): void {
    if (!this.changePasswordForm.valid) return;

    console.log(this.changePasswordForm.value);
    this.buildChangePasswordForm();
    this.removeValidators(this.changePasswordForm);
  }
}
