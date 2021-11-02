import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IS_DECIMAL } from 'src/app/core/helpers';
import { CowBreedService } from 'src/app/core/services';

@Component({
  selector: 'app-update-nutrition-dialog',
  templateUrl: './update-nutrition-dialog.component.html',
  styleUrls: ['./update-nutrition-dialog.component.scss'],
})
export class UpdateNutritionDialogComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  period!: any;

  constructor(
    private fb: FormBuilder,
    private cowBreedService: CowBreedService,
    public dialogRef: MatDialogRef<UpdateNutritionDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.period = this.data.period;
  }

  ngOnInit(): void {
    this.buildFormArray();
    this.setNutritionValue(this.period.nutrition);
  }

  get f() {
    return this.form.controls;
  }

  get nutritionForm() {
    return this.form.get('nutrition') as FormArray;
  }

  buildFormArray() {
    this.form = this.fb.group({
      nutrition: this.fb.array([]),
    });
  }

  setNutritionValue(nutrition: any) {
    this.nutritionForm.clear();
    const _nutrition = [...nutrition];
    _nutrition.forEach((i) => {
      let nu: FormGroup = this.createNutrition();
      nu.patchValue(i);
      this.nutritionForm.push(nu);
    });
  }

  createNutrition() {
    return this.fb.group({
      name: [''],
      amount: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(IS_DECIMAL),
        ],
      ],
      unit: [''],
    });
  }

  addNutrition(event: any) {
    event.preventDefault();
    this.nutritionForm.push(this.createNutrition());
  }

  removeNutrition(index: number, event: any) {
    event.preventDefault();
    this.nutritionForm.removeAt(index);
  }

  disableSubmitButton() {
    if (this.form.valid && this.form.dirty && !this.submitted) {
      return false;
    }
    return true;
  }

  onSubmit() {
    if (!this.form.valid) return;

    this.submitted = true;
    const nutrition = [...this.form.value.nutrition].map((item) => {
      return {
        ...item,
        amount: Number(item.amount),
      };
    });
    this.cowBreedService
      .updatePeriod(this.period._id, { nutrition })
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

        this.dialogRef.close({
          type: 'update',
          status: 'success',
        });
        this.submitted = false;
      });
  }

  onReset() {
    this.buildFormArray();
    this.setNutritionValue(this.period.nutrition);
  }

  onClose() {
    this.dialogRef.close({
      type: 'close',
      status: null,
    });
  }
}
