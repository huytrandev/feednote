import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService, CowBreedService } from 'src/app/core/services';

@Component({
  selector: 'app-dialog-create-nutrition',
  templateUrl: './dialog-create-nutrition.component.html',
  styleUrls: ['./dialog-create-nutrition.component.scss'],
})
export class DialogCreateNutritionComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  periodId!: string;

  constructor(
    private fb: FormBuilder,
    private cowBreedService: CowBreedService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogCreateNutritionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.periodId = this.data.periodId;
  }

  ngOnInit(): void {
    this.buildFormArray();
  }

  get f() {
    return this.form.controls;
  }

  get nutritionForm() {
    return this.form.get('nutrition') as FormArray;
  }

  buildFormArray() {
    this.form = this.fb.group({
      nutrition: this.fb.array([this.createNutrition()]),
    });
  }

  createNutrition() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      amount: ['', [Validators.required, Validators.min(1)]],
      unit: ['', [Validators.required]],
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

    const nutrition = [...this.form.value.nutrition];
    this.submitted = true;
    this.cowBreedService
      .createNutritionByPeriod(this.periodId, nutrition)
      .subscribe((res) => {
        if (!res.status) {
          this.submitted = false;
          this.commonService.openAlert(
            'Thêm nhu cầu dinh dưỡng thất bại',
            'danger'
          );
          return;
        }

        this.submitted = false;
        this.commonService.openAlert(
          'Thêm nhu cầu dinh dưỡng thành công',
          'success'
        );
        this.dialogRef.close({ success: true });
      });
  }

  onReset() {
    this.buildFormArray();
  }

  onClose() {
    this.dialogRef.close();
  }
}
