import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MustMatch } from 'src/app/core/validations';
import {
  SnackbarService,
  AuthService,
  AreaService,
  UserService,
} from 'src/app/core/services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  loading: boolean = true;
  updateInfoForm: FormGroup;
  changePasswordForm: FormGroup;
  user: any;
  userId: string;
  areas: any = [];
  currentUser: any;
  submitted: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private areaService: AreaService,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
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
      .getUserInfo()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { data, status } = res;
        if (status === false) {
          return this.authService.logout();
        }
        const createdAt = new Date(data.createdAt);
        let roleName = '';
        switch (data.role) {
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

        this.user = { ...data, createdAt, roleName };
        this.setValueForForm({ ...this.user });
        this.loading = false;
      });
  }

  getArea() {
    this.areaService
      .getAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.areas = res.data.items;
      });
  }

  buildUpdateUserInfoForm(): void {
    this.updateInfoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.pattern('[- +()0-9]{10}')]],
      email: ['', [Validators.email]],
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
        const resData = { ...data };
        if (resData.status === true) {
          this.snackbarService.openSnackBar(
            'Cập nhật thành công',
            'success',
            2500
          );
          this.submitted = false;
          setTimeout(() => {
            this.reloadComponent();
          }, 2500);
        } else {
          this.snackbarService.openSnackBar(
            'Cập nhật không thành công',
            'danger',
            2500
          );
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
    this.authService
      .changePassword(this.changePasswordForm.controls.newPassword.value)
      .subscribe((data) => {
        const resData = { ...data };
        if (resData.status === true) {
          this.snackbarService.openSnackBar(
            'Đổi mật khẩu thành công. Vui lòng đăng nhập lại',
            'success',
            2500
          );
          this.submitted = false;
          setTimeout(() => {
            this.authService.logout();
          }, 2500);
        } else {
          this.snackbarService.openSnackBar(
            'Đổi mật không thành công',
            'danger',
            2500
          );
          this.changePasswordForm.reset();
        }
      });
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
