import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaService } from 'src/app/core/services';

@Component({
  selector: 'app-create-update-dialog',
  templateUrl: './create-update-dialog.component.html',
  styleUrls: ['./create-update-dialog.component.scss'],
})
export class CreateUpdateDialogComponent implements OnInit {
  form!: FormGroup;
  area!: any;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private areaService: AreaService,
    public dialogRef: MatDialogRef<CreateUpdateDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.area = data.area;
  }

  ngOnInit(): void {
    this.buildForm();
    if (this.area) {
      this.form.controls['name'].patchValue(this.area.name);
    }
  }

  get f() {
    return this.form.controls;
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }

  onSubmit() {
    if (!this.form.valid) return;

    this.isSubmitting = true;
    if (!this.area) {
      this.areaService.createArea(this.form.value).subscribe((res) => {
        const { status } = res;
        if (!status) {
          this.isSubmitting = false;
          this.dialogRef.close({
            type: 'create',
            status: 'fail',
          });
          return;
        }

        this.isSubmitting = false;
        this.dialogRef.close({
          type: 'create',
          status: 'success',
        });
      });
    } else {
      this.areaService
        .updateArea(this.area._id, this.form.value)
        .subscribe((res) => {
          const { status } = res;
          if (!status) {
            this.isSubmitting = false;
            this.dialogRef.close({
              type: 'update',
              status: 'fail',
            });
            return;
          }

          this.isSubmitting = false;
          this.dialogRef.close({
            type: 'update',
            status: 'success',
          });
        });
    }
  }

  onReset(): void {
    if (this.area) {
      this.form.controls['name'].patchValue(this.area.name);
    } else {
      this.buildForm();
    }
  }

  onClose(): void {
    this.dialogRef.close({
      type: 'close',
      status: null,
    });
  }
}
