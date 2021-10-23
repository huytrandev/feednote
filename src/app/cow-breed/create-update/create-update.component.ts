import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { CowBreedService, CommonService } from 'src/app/core/services';
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
    private cowBreedService: CowBreedService,
    private commonService: CommonService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateUpdateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cowBreedId = this.data.cowBreedId;
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
    this.cowBreedService.fetchCowBreed(this.cowBreedId).subscribe((res) => {
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
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(5)]],
        farmingTime: ['', [Validators.required, Validators.min(10)]],
        periods: this.fb.array([]),
      },
      {
        validator: [Vietnamese('name')],
      }
    );
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
        name: ['', [Validators.required, Validators.minLength(5)]],
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
    this.periods.push(this.createPeriod(this.periods.length));
  }

  removePeriod(index: number, period: any, e: any) {
    e.preventDefault();
    if (
      !!this.isCreate ||
      !this.cowBreed['periods'] ||
      index > this.cowBreed['periods'].length - 1
    ) {
      this.periods.removeAt(index);
      return;
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '460px',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
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
            this.commonService.openAlert('Xoá giai đoạn sinh trưởng thất bại', 'danger');
          }
        });
      }
    });
  }

  onReset() {
    if (!this.cowBreed) {
      this.buildForm();
    } else {
      this.setValueForForm(this.cowBreed);
    }
  }

  onSubmit() {
    if (!this.form.valid) return;

    if (!!this.isCreate) {
      this.submitted = true;
      this.cowBreedService.createCowBreed(this.form.value).subscribe(
        (res) => {
          const { status } = res;
          if (!status) {
            this.submitted = false;
            this.form.reset();
            this.formGroupDirective.resetForm();
            this.dialogRef.close({
              type: 'create',
              status: 'failure',
            });
            return;
          }
          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.dialogRef.close({
            type: 'create',
            status: 'success',
          });
        },
        (error) => {
          this.submitted = false;
          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.dialogRef.close({
            type: 'create',
            status: 'failure',
          });
        }
      );
    } else {
      this.submitted = true;
      this.cowBreedService.updateCowBreed(this.cowBreedId, this.form.value).subscribe(
        (res) => {
          const { status } = res;
          if (!status) {
            this.submitted = false;
            this.setValueForForm(this.cowBreed);
            this.dialogRef.close({
              type: 'update',
              status: 'failure',
            });
            return;
          }

          this.submitted = false;
          this.dialogRef.close({
            type: 'update',
            status: 'success',
          });
        },
        (error) => {
          this.submitted = false;
          this.setValueForForm(this.cowBreed);
          this.dialogRef.close({
            type: 'update',
            status: 'failure',
          });
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

  onClose() {
    this.dialogRef.close({ type: 'close', status: null });
  }
}
