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
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { AreaService, CommonService, UserService } from 'src/app/core/services';
import { Area, User } from 'src/app/core/models';
import { Vietnamese } from 'src/app/core/validations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.scss'],
})
export class CreateUpdateComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  form!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  breeder!: User;
  areas: Area[] = [];
  breeders: User[] = [];
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private areaService: AreaService,
    public dialogRef: MatDialogRef<CreateUpdateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.breeder = data.breeder;
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.getAreas();
    this.getBreeders();
    this.buildForm();
    if (!!this.breeder) {
      this.removeFormFields();
      this.setValueForForm(this.breeder);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getAreas() {
    this.loading = true;
    this.areaService
      .fetchAreas()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map((res) => {
          const { status } = res;
          if (!status) {
            return [];
          }
          const { data } = res;
          return [...data.items];
        }),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((data: any) => {
        this.areas = data;
        this.loading = false;
      });
  }

  getBreeders() {
    this.loading = true;
    this.userService
      .fetchBreeders()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map((res) => {
          const { status } = res;
          if (!status) {
            return [];
          }
          const { data } = res;
          return [...data.items];
        }),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((data: any) => {
        this.breeders = data;
        this.loading = false;
      });
  }

  validateUsernameExist(control: AbstractControl) {
    return this.userService.fetchManagers().pipe(
      map((res) => {
        const breeders = res.data.items;
        if (breeders.some((b: any) => b.username === control.value)) {
          return { usernameExisted: true };
        } else {
          return null;
        }
      }),
      takeUntil(this.ngUnsubscribe),
      catchError((_) => this.router.navigate(['not-found']))
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
        name: ['', [Validators.required, Validators.minLength(5)]],
        phone: ['', [Validators.pattern('[- +()0-9]{10}')]],
        email: ['', [Validators.email]],
        idArea: ['', [Validators.required]],
      },
      {
        validator: [Vietnamese('name')],
      }
    );
  }

  removeFormFields() {
    this.form.removeControl('username');
    this.form.removeControl('password');
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.submitted = true;
    if (!this.breeder) {
      this.userService.createBreeder(this.form.value).subscribe((res) => {
        const { status } = res;
        if (!status) {
          this.submitted = false;
          this.dialogRef.close({
            type: 'create',
            status: 'fail',
          });
          return;
        }

        this.submitted = false;
        this.dialogRef.close({
          type: 'create',
          status: 'success',
        });
      });
    } else {
      this.userService
        .updateBreeder(this.breeder._id, this.form.value)
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
    if (!this.breeder) {
      this.buildForm();
      return;
    }
    this.setValueForForm(this.breeder);
  }

  setValueForForm(breeder: any) {
    for (let propertyName in this.form.controls) {
      this.form.controls[propertyName].patchValue(breeder[propertyName]);
    }
  }

  onClose() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.dialogRef.close({ type: 'close', status: null });
  }
}
