import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { UserService, AreaService, SnackbarService } from 'src/app/core/services';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  form!: FormGroup;
  breederId!: string;
  loading: boolean = false;
  submitted: boolean = false;
  breeder!: any;
  areas: any = [];
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private areaService: AreaService
  ) {
    this.breederId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.getAreas();
    this.buildForm();
    this.getBreeder();
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

  getBreeder() {
    this.loading = true;
    this.userService
      .getBreederById(this.breederId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((res) => {
        const { status } = res;
        if (!status) {
          console.log(status);
          this.loading = false;
          this.router.navigate(['/not-found']);
          return;
        }
        const { data } = res;
        this.breeder = data;
        this.setValueForForm(this.breeder);
        this.loading = false;
      });
  }

  buildForm(): void {
    this.form = this.fb.group({
      password: ['', [Validators.minLength(5)]],
      name: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.pattern('[- +()0-9]{10}')]],
      email: ['', [Validators.email]],
      idArea: ['', []],
    });
  }

  onSubmit() {
    if (!this.form.valid) return;

    const successNotification = 'Cập nhật hộ dân thành công';
    const failureNotification = 'Cập nhật hộ dân thất bại';
    this.submitted = true;
    this.userService
      .updateBreeder(this.breederId, this.form.value)
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
        this.snackbarService.openSnackBar(successNotification, 'success', 2000);
        this.reloadComponent();
      });
  }

  onReset() {
    this.setValueForForm(this.breeder);
  }

  generatePassword() {
    let generatedPassword = '';
    const passwordLength = 10;

    const numberChars = '0123456789';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    let allChars = numberChars + upperChars + lowerChars;
    let randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray = randPasswordArray.fill(allChars, 3);
    generatedPassword = this.shuffleArray(
      randPasswordArray.map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
    ).join('');

    this.form.controls['password'].patchValue(generatedPassword);
  }

  shuffleArray(array: Array<string>) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  setValueForForm(breeder: any) {
    for (let propertyName in this.form.controls) {
      this.form.controls[propertyName].patchValue(breeder[propertyName]);
    }
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
