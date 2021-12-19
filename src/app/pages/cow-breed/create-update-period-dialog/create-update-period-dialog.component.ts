import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { IS_DECIMAL } from 'src/app/core/helpers';
import { CowBreedService } from 'src/app/core/services';
import { Vietnamese } from 'src/app/core/validations';

@Component({
  selector: 'app-create-update-period-dialog',
  templateUrl: './create-update-period-dialog.component.html',
  styleUrls: ['./create-update-period-dialog.component.scss'],
})
export class CreateUpdatePeriodDialogComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  form!: FormGroup;
  submitted: boolean = false;
  period!: any;
  loading: boolean = false;
  periodId!: string;
  isModified: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cowBreedService: CowBreedService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateUpdatePeriodDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.periodId = this.data.periodId;
  }

  ngOnInit(): void {
    this.buildForm();
    if (!!this.periodId) {
      this.getPeriod();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get f() {
    return this.form.controls;
  }

  get canSubmitForm() {
    return this.form.valid && this.form.dirty && !this.submitted;
  }

  getPeriod(): void {
    this.loading = true;
    this.cowBreedService.fetchPeriod(this.periodId).subscribe((res) => {
      const { data, status } = res;
      if (!status) {
        this.loading = false;
        return;
      }
      this.period = data;
      const { name, startDay, endDay, weight } = this.period;
      this.setValueForForm({ name, startDay, endDay, weight });
      this.loading = false;
    });
  }

  buildForm(): void {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required]],
        startDay: ['', [Validators.required, Validators.min(0)]],
        endDay: ['', [Validators.required, Validators.min(0)]],
        weight: ['', [Validators.required, Validators.min(0)]],
      },
      {
        validator: [Vietnamese('name')],
      }
    );
  }

  setValueForForm(period: any) {
    for (let propertyName in this.form.controls) {
      this.form.controls[propertyName].patchValue(period[propertyName]);
    }
  }

  createNutrition() {
    return this.fb.group({
      idNutrition: [''],
      name: ['', [Validators.required]],
      amount: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(IS_DECIMAL),
        ],
      ],
      unit: ['', [Validators.required]],
    });
  }

  onReset() {
    if (!this.period) {
      this.buildForm();
    } else {
      this.setValueForForm(this.period);
    }
  }

  onClose() {
    this.dialogRef.close({ type: 'close', isModified: this.isModified });
  }

  onSubmit() {
    if (!this.form.valid) return;

    this.submitted = true;
    if (!this.period) {
    } else {
      this.cowBreedService
        .updatePeriod(this.periodId, this.form.value)
        .subscribe((res) => {
          const { status } = res;
          if (!status) {
            this.submitted = false;
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
        });
    }
  }
}
