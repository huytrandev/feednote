import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, map, mergeMap, takeUntil } from 'rxjs/operators';
import { DELETE_DIALOG_CONFIG } from 'src/app/core/constant';
import { CREATE_UPDATE_DIALOG_CONFIG } from 'src/app/core/constant/create-update-dialog.config';
import {
  CommonService,
  CowBreedService,
  MealService,
} from 'src/app/core/services';
import { DialogComponent } from 'src/app/shared';
import { DialogCreateNutritionComponent } from '../dialog-create-nutrition/dialog-create-nutrition.component';
import { DialogUpdateNutritionComponent } from '../dialog-update-nutrition/dialog-update-nutrition.component';

@Component({
  selector: 'app-period-detail',
  templateUrl: './period-detail.component.html',
  styleUrls: ['./period-detail.component.scss'],
})
export class PeriodDetailComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  nutritionColumns = ['id', 'name', 'amount', 'actions'];
  mealColumns = ['id', 'name', 'amount'];
  periodId!: string;
  cowBreedId!: string;
  period!: any;
  cowBreed!: any;
  meals!: any;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cowBreedService: CowBreedService,
    private mealService: MealService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.periodId = this.route.snapshot.paramMap.get('id')!;
    this.cowBreedId = this.route.snapshot.paramMap.get('idCowBreed')!;
  }

  ngOnInit(): void {
    this.getPeriod();
    this.getMeals();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getPeriod(): void {
    this.loading = true;
    this.cowBreedService
      .fetchPeriod(this.periodId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: any) => {
        const { status, data } = res;
        if (!status) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.period = data;
        this.loading = false;
      });
  }

  getMeals() {
    this.loading = true;
    const query = {
      filter: {
        idPeriod: this.periodId,
      },
      skip: 0,
      limit: 1,
    };

    this.mealService
      .fetchMeals(query)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { status, data } = res;
        if (!status) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.meals = data.items;
        this.loading = false;
      });
  }

  onDeletePeriod() {
    const dialogRef = this.dialog.open(DialogComponent, DELETE_DIALOG_CONFIG);

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.cowBreedService.deletePeriod(this.periodId).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert('Xoá giai đoạn thành công', 'success');
            this.router.navigate(['/cow-breeds']);
          } else {
            this.commonService.openAlert('Xoá giai đoạn thất bại', 'danger');
          }
        });
      }
    });
  }

  onDeleteNutrition(periodId: string, nutritionId: string) {
    const dialogRef = this.dialog.open(DialogComponent, DELETE_DIALOG_CONFIG);

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.cowBreedService
          .deleteNutritionOfPeriod(periodId, nutritionId)
          .subscribe((res) => {
            const { status } = res;
            if (status === true) {
              this.commonService.openAlert(
                'Xoá thành phần dinh dưỡng thành công',
                'success'
              );
              this.getPeriod();
            } else {
              this.commonService.openAlert(
                'Xoá thành phần dinh dưỡng thất bại',
                'danger'
              );
            }
          });
      }
    });
  }

  createNutrition(periodId: string) {
    const dialogRef = this.dialog.open(DialogCreateNutritionComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      data: {
        periodId,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      const { type, status } = res;
      if (type === 'create' && status === 'fail') {
        this.commonService.openAlert('Thêm chất dinh dưỡng thất bại', 'danger');
      } else if (type === 'create' && status === 'success') {
        this.commonService.openAlert(
          'Thêm chất dinh dưỡng thành công',
          'success'
        );
        this.getPeriod();
      } else {
        return;
      }
    });
  }

  updateNutrition(periodId: string, nutrition: any) {
    const dialogRef = this.dialog.open(DialogUpdateNutritionComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      data: {
        periodId,
        nutrition,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.success) {
        this.getPeriod();
      }
    });
  }
}
