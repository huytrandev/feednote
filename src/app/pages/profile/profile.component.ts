import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import {
  AuthService,
  AreaService,
  UserService,
  CommonService,
} from 'src/app/core/services';
import { User, Area } from 'src/app/core/models';
import { Vietnamese, MustMatch } from 'src/app/core/validations';
import { getRoleName, formatDate } from 'src/app/core/helpers/functions'

@Component({
  selector: 'app-main',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
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
        const userData = {
          ...data,
          roleName: getRoleName(data.role),
          joinedDate: formatDate(data.createdAt)
        }
        this.user = userData;
        this.setValueForForm({ ...userData });
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
        name: ['', [Validators.required]],
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
          this.commonService.openAlert('C???p nh???t th??nh c??ng', 'success');
          this.submitted = false;
          this.getUser();
        } else {
          this.commonService.openAlert('C???p nh???t kh??ng th??nh c??ng', 'danger');
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
            '?????i m???t kh???u th??nh c??ng. Vui l??ng ????ng nh???p l???i',
            'success'
          );
          this.submitted = false;
          setTimeout(() => {
            this.authService.logout();
          }, 2500);
        } else {
          this.commonService.openAlert('?????i m???t kh??ng th??nh c??ng', 'danger');
          this.changePasswordForm.reset();
        }
      });
  }
}
