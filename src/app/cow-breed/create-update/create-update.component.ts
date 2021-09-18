import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CowBreedService } from 'src/app/_services/cow-breed.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.scss'],
})
export class CreateUpdateComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  form!: FormGroup;
  isAddPeriod: boolean = false;
  submitted: boolean = false;
  cowBreed: any;
  loading: boolean = false;

  isCreate: boolean = true;
  cowBreedId!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cowBreedService: CowBreedService,
    private snackbarService: SnackbarService
  ) {
    this.cowBreedId = this.route.snapshot.paramMap.get('id')!;
    this.isCreate = !this.cowBreedId;
  }

  ngOnInit(): void {
    this.buildForm();
    if (!this.isCreate) {
      this.getCowBreed();
    }
  }

  getCowBreed(): void {
    this.loading = true;
    this.cowBreedService.getById(this.cowBreedId).subscribe((res) => {
      const { data, status } = res;
      if (!status) {
        this.loading = false;
        return;
      }
      this.cowBreed = data;
      this.loading = false;
      const { name, farmingTime, periods } = this.cowBreed;
      this.setValueForForm({ name, farmingTime, periods });
    });
  }

  get f() {
    return this.form.controls;
  }

  get periods(): FormArray {
    return this.form.get('periods') as FormArray;
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      farmingTime: ['', [Validators.required, Validators.min(10)]],
      periods: this.fb.array([this.createPeriod()]),
    });
  }

  setValueForForm(cowBreed: any) {
    for (let propertyName in this.form.controls) {
      this.form.controls[propertyName].patchValue(cowBreed[propertyName]);
      if (propertyName === 'periods') {
        if (!!cowBreed[propertyName]) {
          this.setPeriodsForm(cowBreed[propertyName]);
        } else {
          this.periods.clear();
        }
      }
    }
  }

  setPeriodsForm(cowBreedPeriods: any) {
    this.periods.clear();
    const periods = [...cowBreedPeriods];
    periods.forEach((p) => {
      let period: FormGroup = this.createPeriod();
      period.patchValue(p);
      this.periods.push(period);
    });
  }

  createPeriod() {
    return this.fb.group({
      _id: [''],
      name: ['', [Validators.required, Validators.minLength(5)]],
      serial: ['', [Validators.required]],
      startDay: ['', [Validators.required, Validators.min(1)]],
      endDay: ['', [Validators.required, Validators.min(1)]],
      weight: ['', [Validators.required, Validators.min(10)]],
    });
  }

  addPeriod(e: any) {
    e.preventDefault();
    this.periods.push(this.createPeriod());
  }

  removePeriod(index: number) {
    this.periods.removeAt(index);
  }

  onReset() {
    if (!!this.isCreate) {
      this.buildForm();
    } else {
      this.setValueForForm(this.cowBreed);
    }
  }

  onSubmit() {
    if (!this.form.valid) return;

    const successNotification = !!this.isCreate
      ? 'Tạo mới giống bò thành công'
      : 'Cập nhật giống bò thành công';
    const failureNotification = !!this.isCreate
      ? 'Tạo mới giống bò thất bại'
      : 'Cập nhật giống bò thất bại';

    if (!!this.isCreate) {
      this.submitted = true;
      this.cowBreedService.create(this.form.value).subscribe(
        (res) => {
          const { status } = res;
          if (!status) {
            this.submitted = false;
            this.form.reset();
            this.formGroupDirective.resetForm();
            this.snackbarService.openSnackBar(
              failureNotification,
              'danger',
              2000
            );
            return;
          }

          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.snackbarService.openSnackBar(
            successNotification,
            'success',
            2000
          );
        },
        (error) => {
          this.submitted = false;
          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.snackbarService.openSnackBar(
            failureNotification,
            'danger',
            2000
          );
        }
      );
    } else {
      this.submitted = true;
      this.cowBreedService.update(this.cowBreedId, this.form.value).subscribe(
        (res) => {
          const { status } = res;
          if (!status) {
            this.submitted = false;
            this.setValueForForm(this.cowBreed);
            this.snackbarService.openSnackBar(
              failureNotification,
              'danger',
              2000
            );
            return;
          }

          this.submitted = false;
          this.reloadComponent();
          this.snackbarService.openSnackBar(
            successNotification,
            'success',
            2000
          );
        },
        (error) => {
          this.submitted = false;
          this.submitted = false;
          this.setValueForForm(this.cowBreed);
          this.snackbarService.openSnackBar(
            failureNotification,
            'danger',
            2000
          );
        }
      );
    }
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
