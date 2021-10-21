import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { CommonService, FoodService } from 'src/app/core/services';
import { DialogComponent } from 'src/app/shared';
import { CreateUpdateComponent } from '../create-update/create-update.component';

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
  ingredientColumns = ['id', 'name', 'amount'];

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
    this.getFood();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getFood(): void {
    this.loading = true;
    this.foodService
      .fetchFood(this.foodIdParam)
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

  updateFood(food: any) {
    const dialogRef = this.dialog.open(CreateUpdateComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '50%',
      minWidth: '550px',
      maxWidth: '700px',
      minHeight: '250px',
      maxHeight: '100vh',
      disableClose: true,
      data: {
        food
      }
    });
    
    dialogRef.afterClosed().subscribe((res) => {
      const { type, status } = res;
      if (type === 'update' && status === 'success') {
        this.commonService.openAlert('Cập nhật thức ăn thành công', 'success');
        this.getFood();
      } else if (type === 'update' && status === 'failure') {
        this.commonService.openAlert('Cập nhật thức ăn thất bại', 'danger');
      }
    });
  }
}
