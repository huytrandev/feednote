import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import {
  AuthService,
  AreaService,
  UserService,
  CommonService,
} from 'src/app/core/services';
import { User, Area } from 'src/app/core/models';
import { Vietnamese, MustMatch } from 'src/app/core/validations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  loading: boolean = true;
  updateInfoForm: FormGroup;
  changePasswordForm: FormGroup;
  user!: User;
  userId!: string;
  areas: Area[] = [];
  currentUser!: any;
  submitted: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private areaService: AreaService,
    private userService: UserService,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.currentUser = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.getUser();
    this.getArea();
    this.buildUpdateUserInfoForm();
    this.buildChangePasswordForm();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get f1() {
    return this.updateInfoForm.controls;
  }

  get f2() {
    return this.changePasswordForm.controls;
  }

  getUser(): void {
    this.userService
      .fetchPersonalInfo()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((res) => {
        const { data, status } = res;
        if (status === false) {
          return this.authService.logout();
        }
        this.user = data;
        this.setValueForForm({ ...this.user });
        this.loading = false;
      });
  }

  getArea() {
    this.areaService
      .fetchAreas()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((res) => {
        this.areas = res.data.items;
      });
  }

  buildUpdateUserInfoForm(): void {
    this.updateInfoForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        phone: ['', [Validators.pattern('[- +()0-9]{10}')]],
        email: ['', [Validators.email]],
        idArea: ['', [Validators.required]],
      },
      {
        validator: Vietnamese('name'),
      }
    );
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
      .updatePersonalInfo(this.updateInfoForm.value)
      .subscribe((data) => {
        const resData = { ...data };
        if (resData.status === true) {
          this.commonService.openAlert('Cập nhật thành công', 'success');
          this.submitted = false;
          this.getUser();
        } else {
          this.commonService.openAlert('Cập nhật không thành công', 'danger');
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
    const password = this.changePasswordForm.controls.newPassword.value;
    this.authService
      .changePassword(password)
      .subscribe((data) => {
        const resData = { ...data };
        if (resData.status === true) {
          this.commonService.openAlert(
            'Đổi mật khẩu thành công. Vui lòng đăng nhập lại',
            'success'
          );
          this.submitted = false;
          setTimeout(() => {
            this.authService.logout();
          }, 2500);
        } else {
          this.commonService.openAlert('Đổi mật không thành công', 'danger');
          this.changePasswordForm.reset();
        }
      });
  }

  transformDate(date: number) {
    return moment(date).locale('vi').format('L');
  }

  transformRoleName(role: string) {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'manager':
        return 'Cán bộ thú y';
      case 'breeder':
        return 'Hộ nông dân';
      default:
        return 'Hộ nông dân';
    }
  }
}
