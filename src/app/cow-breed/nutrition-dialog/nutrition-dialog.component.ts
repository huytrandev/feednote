import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { CowBreedService } from 'src/app/core/services';

@Component({
  selector: 'app-nutrition-dialog',
  templateUrl: './nutrition-dialog.component.html',
  styleUrls: ['./nutrition-dialog.component.scss'],
})
export class NutritionDialogComponent implements OnInit {
  loading: boolean = true;
  periodId!: string;
  period!: any;
  displayedColumns = ['id', 'name', 'amount', 'unit'];

  constructor(
    public dialogRef: MatDialogRef<NutritionDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private cowBreedService: CowBreedService
  ) {
    this.periodId = this.data.periodId;
  }

  ngOnInit(): void {
    this.getNutrition();
  }

  onClose() {
    this.dialogRef.close();
  }

  getNutrition() {
    this.loading = true;
    this.cowBreedService
      .getNutritionByPeriod(this.periodId)
      .pipe(
        map((res) => {
          if (!res.status) {
            return this.router.navigate(['/not-found']);
          }
          const { _id, name, idCowBreed, nutrition } = res.data;
          return {
            _id,
            name,
            idCowBreed,
            nutrition,
          };
        }),
        catchError((err) => this.router.navigate(['/not-found']))
      )
      .subscribe((data) => {
        if (!data) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.period = data;
        this.loading = false;
      });
  }
}
