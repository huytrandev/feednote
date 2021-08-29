import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaService } from 'src/app/_services/area.service';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss'],
})
export class DialogFormComponent implements OnInit {
  title: string = '';
  local_data: any;
  action: string;
  element: any;
  areas: any[];
  loading: boolean = false;
  form!: FormGroup;
  submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private areaSerive: AreaService,
    private fb: FormBuilder
  ) {
    this.local_data = { ...data };
    this.element = this.local_data.obj;
    this.action = this.local_data.action;
    this.title =
      this.action === 'add' ? 'Thêm thức ăn' : 'Cập nhật thông tin thức ăn';
  }

  ngOnInit(): void {
    this.getArea();
    this.buidForm();
  }

  get f() {
    return this.form.controls;
  }

  buidForm(): void {
    if (this.action === 'add') {
      this.form = this.fb.group({
        name: ['', [Validators.required]],
        ingredient: ['', [Validators.required, Validators.minLength(5)]],
        unit: ['', [Validators.required]],
        idArea: ['', [Validators.required]],
      });
    } else if (this.action === 'edit') {
      this.form = this.fb.group({
        name: [this.element.name, [Validators.required]],
        ingredient: [
          this.element.ingredient,
          [Validators.required, Validators.minLength(5)],
        ],
        unit: [this.element.unit, [Validators.required]],
        idArea: [this.element.idArea, [Validators.required]],
      });
    }
  }

  onSave() {
    if (!this.form.valid) return;

    var { name } = this.form.value;
    name = this.capitalize(name);

    const dataForm = { ...this.form.value, name };

    this.dialogRef.close({
      action: this.action,
      data: dataForm,
    });
  }

  onClose() {
    this.dialogRef.close({ action: 'cancel', data: {} });
  }

  onCancel() {
    this.form.reset();
  }

  getArea() {
    this.loading = true;
    this.areaSerive.getAll().subscribe((res) => {
      const { data } = res;
      this.areas = data.items;
      this.loading = false;
    });
  }

  capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
