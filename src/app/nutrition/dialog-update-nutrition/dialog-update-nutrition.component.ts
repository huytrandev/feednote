import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService, CowBreedService } from 'src/app/core/services';

@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-update-nutrition.component.html',
  styleUrls: ['./dialog-update-nutrition.component.scss'],
})
export class DialogUpdateNutritionComponent implements OnInit {
  loading: boolean = false;
  submitted: boolean = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cowBreedService: CowBreedService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogUpdateNutritionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
  }

  get f() {
    return this.form.controls;
  }

  buildForm(): void {
    this.form = this.fb.group({
      idNutrition: [this.data.nutrition.idNutrition],
      name: [
        this.data.nutrition.name,
        [Validators.required, Validators.minLength(5)],
      ],
      amount: [
        this.data.nutrition.amount,
        [Validators.required, Validators.min(1)],
      ],
      unit: [this.data.nutrition.unit, [Validators.required]],
    });
  }

  onClose() {
    this.dialogRef.close();
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
    this.cowBreedService
      .updateNutrition(this.data.periodId, this.form.value)
      .subscribe((res) => {
        if (!res.status) {
          this.commonService.openAlert(
            'Cập nhật chất dinh dưỡng thất bại',
            'danger'
          );
          this.buildForm();
          this.submitted = false;
          return;
        }
        this.commonService.openAlert(
          'Cập nhật chất dinh dưỡng thành công',
          'success'
        );
        this.submitted = false;
        this.dialogRef.close({ success: true });
      });
  }

  onReset() {
    this.buildForm();
  }
}
