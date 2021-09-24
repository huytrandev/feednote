import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FoodService, SnackbarService } from 'src/app/core';
import { DialogComponent } from 'src/app/shared';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  food: any = {};
  loading: boolean = true;
  error: boolean = false;
  foodIdParam!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private foodService: FoodService,
    private snackbar: SnackbarService,
    public dialog: MatDialog
  ) {
    this.foodIdParam = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loading = true;
    this.getCowBreed();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getCowBreed(): void {
    this.foodService
      .getById(this.foodIdParam)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        const { status } = response;
        if (!status) {
          this.loading = false;
          this.error = true;
          return;
        }
        const { data } = response;
        this.food = data;
        this.loading = false;
      });
  }

  onDelete() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.food.delete(this.foodIdParam).subscribe((res: any) => {
          const { status } = res;
          if (status === true) {
            this.snackbar.openSnackBar(
              'Xoá thức ăn thành công',
              'success',
              2000
            );
            this.router.navigate(['/foods']);
          } else {
            this.snackbar.openSnackBar('Xoá thức ăn thất bại', 'danger', 2000);
          }
        });
      }
    });
  }
}
