import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-nutrition-dialog',
  templateUrl: './nutrition-dialog.component.html',
  styleUrls: ['./nutrition-dialog.component.scss'],
})
export class NutritionDialogComponent implements OnInit {
  loading: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<NutritionDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  onClose() {
    this.dialogRef.close();
  }
}
