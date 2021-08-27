import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


import { MustMatch } from '../helpers/must-match.validator';
import { AreaService } from '../_services/area.service';
import { AuthService } from '../_services/auth.service';
import { SnackbarService } from '../_services/snackbar.service';
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
  currentUser: any;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private areaSerive: AreaService,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {
    this.userId = this.route.snapshot.params.id;
    this.currentUser = this.authService.currentUserValue;
    
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
    if (this.currentUser.role === 'admin') {
      this.userService.getAdminInfoById(this.userId).subscribe((data) => {
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

        this.user = { ...data.data, createdAt, roleName };
        this.setValueForForm({ ...this.user });
        this.loading = false;
      });
    } else if (this.currentUser.role === 'manager') {
      this.userService.getVeterinaryInfoById(this.userId).subscribe((data) => {
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

        this.user = { ...data.data, createdAt, roleName };
        this.setValueForForm({ ...this.user });
        this.loading = false;
      });
    } else {
      this.userService.getUserInfoById(this.userId).subscribe((data) => {
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

        this.user = { ...data.data, createdAt, roleName };
        this.setValueForForm({ ...this.user });
        this.loading = false;
      });
    }
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

    this.submitted = true;
    this.userService
      .updateUserInfo(this.updateInfoForm.value)
      .subscribe((data) => {
        const resData = {...data};
        if (resData.status === true) {
          this.snackbarService.openSnackBar('Cập nhật thành công', 'success', 2500);
          this.submitted = false;
        } else {
          this.snackbarService.openSnackBar('Cập nhật không thành công', 'danger', 2500);
          this.resetUserInfo();
        }
        
      });
  }

  resetUserInfo(): void {
    this.setValueForForm(this.user);
  }

  changePassword(): void {
    if (!this.changePasswordForm.valid) return;

    this.submitted = true;
    this.authService.changePassword(this.changePasswordForm.controls.newPassword.value).subscribe(data => {
      const resData = {...data};
      if (resData.status === true) {
        this.snackbarService.openSnackBar('Đổi mật khẩu thành công. Vui lòng đăng nhập lại', 'success', 2500);
        this.submitted = false;
        setTimeout(() => {
          this.authService.logout();
        }, 3000);
      } else {
        this.snackbarService.openSnackBar('Đổi mật không thành công', 'danger', 2500);
        this.changePasswordForm.reset();
      }
    })
    console.log(this.changePasswordForm.value);
  }
}
