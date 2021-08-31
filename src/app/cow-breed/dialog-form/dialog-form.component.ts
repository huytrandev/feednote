import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  loading: boolean = false;
  form!: FormGroup;
  submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.local_data = { ...data };
    this.element = this.local_data.obj;
    this.action = this.local_data.action;
    this.title =
      this.action === 'add' ? 'Thêm giống bò' : 'Cập nhật thông tin giống bò';
  }

  ngOnInit(): void {}

  
}
