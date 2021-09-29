import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { CommonService, FoodService } from 'src/app/core/services';
import { DialogComponent } from 'src/app/shared';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  food: any = {};
  loading: boolean = true;
  error: boolean = false;
  foodIdParam!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private foodService: FoodService,
    private commonService: CommonService,
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
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
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
      width: '400px',
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.food.delete(this.foodIdParam).subscribe((res: any) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert('Xoá thức ăn thành công', 'success');
            this.router.navigate(['/foods']);
          } else {
            this.commonService.openAlert('Xoá thức ăn thất bại', 'danger');
          }
        });
      }
    });
  }
}
