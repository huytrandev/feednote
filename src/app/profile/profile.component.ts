import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MustMatch } from '../helpers/must-match.validator';
import { AreaService } from '../_services/area.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  loading: boolean = true;
  updateInfoForm: FormGroup;
  changePasswordForm: FormGroup;
  user: any;
  userId: string;
  areas: any = [];

  constructor(
    private fb: FormBuilder,
    private areaSerive: AreaService,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.userId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getUser();
    this.getArea();
    this.buildUpdateUserInfoForm();
    this.buildChangePasswordForm();
  }

  get f1() {
    return this.updateInfoForm.controls;
  }

  get f2() {
    return this.changePasswordForm.controls;
  }

  getUser(): void {
    this.userService.getUserById(this.userId).subscribe((data) => {
      const createdAt = new Date(data.data.createdAt);
      let roleName = '';
      switch (data.data.role) {
        case 'admin':
          roleName = 'Quản trị viên';
          break;
        case 'manager':
          roleName = 'Cán bộ thú y';
          break;
        case 'breeder':
          roleName = 'Nông dân';
          break;
      }

      console.log(roleName);
      this.user = { ...data.data, createdAt, roleName };
      this.setValueForForm({ ...this.user });
      this.loading = false;
    });
  }

  getArea() {
    this.areaSerive.getAll().subscribe((res) => {
      this.areas = res.data.items;
    });
  }

  buildUpdateUserInfoForm(): void {
    this.updateInfoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern('[- +()0-9]{10}')]],
      email: ['', [Validators.required, Validators.email]],
      idArea: ['', [Validators.required]],
    });
  }

  buildChangePasswordForm(): void {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(3)]],
        newPassword: ['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: MustMatch('newPassword', 'confirmPassword'),
      }
    );
  }

  setValueForForm(user: any) {
    for (let propertyName in this.updateInfoForm.controls) {
      this.updateInfoForm.controls[propertyName].setValue(user[propertyName]);
    }
  }

  onUpdateUserInfo(): void {
    if (!this.updateInfoForm.valid) return;

    console.log(this.updateInfoForm.value);
  }

  resetUserInfo(): void {
    this.setValueForForm(this.user);
  }

  changePassword(): void {
    if (!this.changePasswordForm.valid) return;
    console.log(this.changePasswordForm.value);
  }
}
