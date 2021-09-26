import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { AreaService, SnackbarService, UserService } from 'src/app/core/services';
import { Area, User } from 'src/app/core/models';
import { Vietnamese } from 'src/app/core/validations';
import { GeneratePassword } from 'src/app/core/helpers';

@Component({
  selector: 'app-create',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.scss'],
})
export class CreateUpdateComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  form!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  userId!: string;
  user!: any;
  areas: Area[] = [];
  users: User[] = [];
  managers: User[] = [];
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private areaService: AreaService
  ) {
    this.userId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.getAreas();
    this.getManagers();
    this.getUsers();
    this.buildForm();
    if (!!this.userId) {
      this.removeFields();
      this.getUser();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  removeFields() {
    this.form.removeControl('username');
  }

  get f() {
    return this.form.controls;
  }

  getAreas() {
    this.loading = true;
    this.areaService
      .getAll()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((res) => {
        const { status } = res;
        if (!status) {
          return;
        }
        const { data } = res;
        this.areas = data.items;
        this.loading = false;
      });
  }

  getUsers() {
    this.loading = true;
    this.userService
      .getAllUsers()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((res) => {
        const { status } = res;
        if (!status) {
          return;
        }
        const { data } = res;
        this.users = data.items;
        this.loading = false;
      });
  }

  getUser() {
    this.loading = true;
    this.userService
      .getUserById(this.userId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((res) => {
        const { status } = res;
        if (!status) {
          return;
        }
        const { data } = res;
        this.user = data;
        const isManager = this.user.idManager ? false : true;
        this.setValueForForm({ ...this.user, isManager });
        this.loading = false;
      });
  }

  getManagers() {
    this.loading = true;
    this.userService
      .getAllManager()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((res) => {
        const { status } = res;
        if (!status) {
          return;
        }
        const { data } = res;
        this.managers = data.items;
        this.loading = false;
      });
  }

  validateUsernameExist(control: AbstractControl) {
    return this.userService
      .getAllUsers()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .pipe(
        map((res) => {
          const users = res.data.items;
          if (users.some((b: any) => b.username === control.value)) {
            return { usernameExisted: true };
          } else {
            return null;
          }
        })
      );
  }

  buildForm(): void {
    this.form = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(/^[\w\s]+$/),
          ],
          this.validateUsernameExist.bind(this),
        ],
        password: ['', [Validators.required, Validators.minLength(5)]],
        isManager: [false],
        idManager: [null, [Validators.required]],
        name: ['', [Validators.required, Validators.minLength(5)]],
        phone: ['', [Validators.pattern('[- +()0-9]{10}')]],
        email: ['', [Validators.email]],
        idArea: ['', [Validators.required]],
      },
      {
        validator: [Vietnamese('name')],
      }
    );

    this.form.get('isManager')?.valueChanges.subscribe((val) => {
      if (this.form.get('isManager')?.value === false) {
        this.form.controls['idManager'].setValidators([Validators.required]);
      } else {
        this.form.controls['idManager'].clearValidators();
      }
      this.form.controls['idManager'].updateValueAndValidity();
    });

    if (!!this.userId) {
      this.form.controls['password'].setValidators([Validators.minLength(5)]);
      this.form.controls['password'].updateValueAndValidity();
    }
  }

  onSubmit() {
    if (!this.form.valid) return;

    const { isManager } = this.form.value;
    const role = isManager ? 'manager' : 'breeder';

    const successNotification = !this.userId
      ? 'Tạo mới người dùng thành công'
      : 'Cập nhật người dùng thành công';
    const failureNotification = !this.userId
      ? 'Tạo mới người dùng thất bại'
      : 'Cập nhật người dùng thất bại';
    this.submitted = true;

    if (!this.userId) {
      this.userService
        .createUser({ ...this.form.value, role })
        .subscribe((res) => {
          const { status } = res;
          if (!status) {
            this.snackbarService.openSnackBar(
              failureNotification,
              'danger',
              2000
            );
            this.submitted = false;
            return;
          }

          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.snackbarService.openSnackBar(
            successNotification,
            'success',
            2000
          );
        });
    } else {
      if (isManager) {
        this.form.value.idManager = null;
      }
      console.log({ ...this.form.value, role });

      this.userService
        .updateUser(this.userId, { ...this.form.value, role })
        .subscribe((res) => {
          const { status } = res;
          if (!status) {
            this.snackbarService.openSnackBar(
              failureNotification,
              'danger',
              2000
            );
            this.submitted = false;
            return;
          }

          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.snackbarService.openSnackBar(
            successNotification,
            'success',
            2000
          );
        });
    }
  }

  onReset() {
    if (!this.userId) {
      this.buildForm();
      return;
    }
    this.setValueForForm(this.user);
  }

  generatePassword() {
    let generatedPassword = new GeneratePassword().generatePassword();
    this.form.controls['password'].patchValue(generatedPassword);
  }

  setValueForForm(user: any) {
    for (let propertyName in this.form.controls) {
      this.form.controls[propertyName].patchValue(user[propertyName]);
    }
  }
}
