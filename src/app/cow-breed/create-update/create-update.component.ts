import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import {
  CowBreedService,
  CommonService,
} from 'src/app/core/services';
import { LessThan, Vietnamese } from 'src/app/core/validations';
import { DialogComponent } from 'src/app/shared';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.scss'],
})
export class CreateUpdateComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  form!: FormGroup;
  submitted: boolean = false;
  cowBreed: any;
  loading: boolean = false;
  isCreate: boolean = true;
  cowBreedId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cowBreedService: CowBreedService,
    private commonService: CommonService,
    public dialog: MatDialog
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
        ],
      ],
      farmingTime: ['', [Validators.required, Validators.min(10)]],
      periods: this.fb.array([]),
    },{
      validator: [Vietnamese('name')]
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
    periods.forEach((p, index) => {
      let period: FormGroup = this.createPeriod(index);
      period.patchValue(p);
      this.periods.push(period);
    });
  }

  createPeriod(serial: number) {
    return this.fb.group(
      {
        _id: [''],
        serial: [serial + 1],
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
          ],
        ],
        startDay: ['', [Validators.required, Validators.min(1)]],
        endDay: ['', [Validators.required, Validators.min(1)]],
        weight: ['', [Validators.required, Validators.min(10)]],
      },
      {
        validator: [LessThan('startDay', 'endDay'), Vietnamese('name')],
      }
    );
  }

  addPeriod(e: any) {
    e.preventDefault();
    console.log(this.periods.length);
    this.periods.push(this.createPeriod(this.periods.length));
  }

  removePeriod(index: number, period: any, e: any) {
    e.preventDefault();
    if (!!this.isCreate || !this.cowBreed['periods']) {
      this.periods.removeAt(index);
      return;
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      disableClose: true,
      autoFocus: false,
    });

    const { _id } = period;

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.cowBreedService.deletePeriod(_id).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert(
              'Xoá giai đoạn sinh trưởng thành công',
              'success'
            );
            this.periods.removeAt(index);
          } else {
            this.commonService.openAlert('Xoá giai đoạn sinh trưởng', 'danger');
          }
          // this.commonService.reloadComponent();
        });
      }
    });
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
            this.commonService.openAlert(failureNotification, 'danger');
            return;
          }
          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.commonService.openAlert(successNotification, 'success');
        },
        (error) => {
          this.submitted = false;
          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.commonService.openAlert(failureNotification, 'danger');
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
            this.commonService.openAlert(failureNotification, 'danger');
            return;
          }

          this.submitted = false;
          this.commonService.reloadComponent();
          this.commonService.openAlert(successNotification, 'success');
        },
        (error) => {
          this.submitted = false;
          this.submitted = false;
          this.setValueForForm(this.cowBreed);
          this.commonService.openAlert(failureNotification, 'danger');
        }
      );
    }
  }

  canSubmit(): boolean {
    if (!this.form.valid) {
      return false;
    }
    if (!this.form.dirty) {
      return false;
    }
    return true;
  }
}
