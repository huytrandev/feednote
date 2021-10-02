import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-edit.component.html',
  styleUrls: ['./dialog-edit.component.scss'],
})
export class DialogEditComponent implements OnInit {
  loading: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogEditComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  onClose() {
    this.dialogRef.close();
  }
}
