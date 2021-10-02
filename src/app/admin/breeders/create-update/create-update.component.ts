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

import { AreaService, CommonService, UserService } from 'src/app/core/services';
import { Area, User } from 'src/app/core/models';
import { Vietnamese } from 'src/app/core/validations';

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
  breederId!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private areaService: AreaService,
    private commonService: CommonService
  ) {
    this.breederId = this.route.snapshot.paramMap.get('id')!;
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.getAreas();
    this.getBreeders();
    this.buildForm();
    if (!!this.breederId) {
      this.removeFormFields();
      this.getBreeder();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getAreas() {
    this.loading = true;
    this.areaService
      .getAll()
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
      .getAllBreeders()
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

  getBreeder() {
    this.loading = true;
    this.userService
      .getBreederById(this.breederId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map((res) => {
          const { status } = res;
          if (!status) {
            return null;
          }
          const { data } = res;
          return { ...data };
        }),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((data: any) => {
        this.breeder = data;
        this.setValueForForm({ ...this.breeder });
        this.loading = false;
      });
  }

  validateUsernameExist(control: AbstractControl) {
    return this.userService.getAllBreeders().pipe(
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

    const successNotification = !this.breederId
      ? 'Tạo mới hộ dân thành công'
      : 'Cập nhật hộ dân thành công';
    const failureNotification = !this.breederId
      ? 'Tạo mới hộ dân thất bại'
      : 'Cập nhật hộ dân thất bại';
    this.submitted = true;

    if (!this.breederId) {
      this.userService.createBreeder(this.form.value).subscribe((res) => {
        const { status } = res;
        if (!status) {
          this.commonService.openAlert(failureNotification, 'danger');
          this.submitted = false;
          return;
        }

        this.submitted = false;
        this.formGroupDirective.resetForm();
        this.commonService.openAlert(successNotification, 'success');
      });
    } else {
      this.userService
        .updateBreeder(this.breederId, this.form.value)
        .subscribe((res) => {
          const { status } = res;
          if (!status) {
            this.commonService.openAlert(failureNotification, 'danger');
            this.submitted = false;
            return;
          }

          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.commonService.openAlert(successNotification, 'success');
          this.commonService.reloadComponent();
        });
    }
  }

  onReset() {
    if (!this.breederId) {
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
}
