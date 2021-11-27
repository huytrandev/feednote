import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import {
  AreaService,
  UserService,
} from 'src/app/core/services';
import { Area, User } from 'src/app/core/models';
import { Vietnamese } from 'src/app/core/validations';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { VIETNAMESE_PHONE_NUMBER, USERNAME } from 'src/app/core/helpers/regex-regular';

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
  user!: any;
  areas: Area[] = [];
  users: User[] = [];
  managers: User[] = [];
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private areaService: AreaService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateUpdateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
  }

  ngOnInit(): void {
    this.getAreas();
    this.getManagers();
    this.getUsers();
    this.buildForm();
    if (!!this.user) {
      this.removeFormFields();
      this.setValueForForm(this.user);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  removeFormFields() {
    this.form.removeControl('username');
    this.form.removeControl('password');
  }

  get f() {
    return this.form.controls;
  }

  getAreas() {
    this.loading = true;
    this.areaService
      .fetchAreas()
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
      .fetchUsers()
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

  getManagers() {
    this.loading = true;
    this.userService
      .fetchManagers()
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
      .fetchUsers()
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
            Validators.pattern(USERNAME),
          ],
          this.validateUsernameExist.bind(this),
        ],
        password: ['', [Validators.required, Validators.minLength(5)]],
        isManager: [false],
        idManager: [null, [Validators.required]],
        name: ['', [Validators.required, Validators.minLength(5)]],
        phone: ['', [Validators.pattern(VIETNAMESE_PHONE_NUMBER)]],
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

    if (!!this.user) {
      this.form.controls['password'].setValidators([Validators.minLength(5)]);
      this.form.controls['password'].updateValueAndValidity();
    }
  }

  onSubmit() {
    if (!this.form.valid) return;

    const { isManager } = this.form.value;
    const role = isManager ? 'manager' : 'breeder';
    this.submitted = true;

    if (!this.user) {
      this.userService
        .createUser({ ...this.form.value, role })
        .subscribe((res) => {
          const { status } = res;
          if (!status) {
            this.submitted = false;
            this.dialogRef.close({
              type: 'create',
              status: 'fail',
            });
            return;
          }

          this.formGroupDirective.resetForm();
          this.submitted = false;
          this.dialogRef.close({
            type: 'create',
            status: 'success',
          });
        });
    } else {
      if (isManager) {
        this.form.value.idManager = null;
      }

      this.userService
        .updateUser(this.user._id, { ...this.form.value, role })
        .subscribe((res) => {
          const { status } = res;
          if (!status) {
            this.submitted = false;
            this.dialogRef.close({
              type: 'update',
              status: 'fail',
            });
            return;
          }

          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.dialogRef.close({
            type: 'update',
            status: 'success',
          });
        });
    }
  }

  onReset() {
    if (!this.user) {
      this.buildForm();
      return;
    }
    this.setValueForForm(this.user);
  }

  setValueForForm(user: any) {
    for (let propertyName in this.form.controls) {
      this.form.controls[propertyName].patchValue(user[propertyName]);
    }
  }

  onClose() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.dialogRef.close({ type: 'close', status: null });
  }
}
