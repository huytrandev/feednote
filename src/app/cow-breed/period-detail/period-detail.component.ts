import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DELETE_DIALOG_CONFIG } from 'src/app/core/constant';
import { CREATE_UPDATE_DIALOG_CONFIG } from 'src/app/core/constant/create-update-dialog.config';
import {
  CommonService,
  CowBreedService,
  MealService,
} from 'src/app/core/services';
import { DialogComponent } from 'src/app/shared';
import { CreateStandardMealDialogComponent } from '../create-standard-meal-dialog/create-standard-meal-dialog.component';
import { CreateUpdatePeriodDialogComponent } from '../create-update-period-dialog/create-update-period-dialog.component';
import { UpdateNutritionDialogComponent } from '../update-nutrition-dialog/update-nutrition-dialog.component';

@Component({
  selector: 'app-period-detail',
  templateUrl: './period-detail.component.html',
  styleUrls: ['./period-detail.component.scss'],
})
export class PeriodDetailComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  nutritionColumns = ['id', 'name', 'amountNutrition'];
  mealColumns = ['id', 'name', 'amount', 'actions'];
  periodId!: string;
  cowBreedId!: string;
  period!: any;
  cowBreed!: any;
  meals!: any;
  loading: boolean = true;
  isModified: boolean = false;

  isEditing: boolean = false;
  mealEachArea: any[] = [];

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
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
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
        const areas: any[] = [];
        this.meals = data.items;
        [...data.items].forEach((m) => {
          if (!areas.find((a) => a === m.idArea)) {
            areas.push(m.idArea);
            this.mealEachArea.push(m);
          }
        });
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

  onDeleteFoodOfMeal(mealId: string, foodId: string) {
    const dialogRef = this.dialog.open(DialogComponent, DELETE_DIALOG_CONFIG);
    console.log(mealId, foodId);

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.mealService.deleteFood(mealId, foodId).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert('Xoá thức ăn thành công', 'success');
            this.getMeals();
          } else {
            this.commonService.openAlert('Xoá thức ăn thất bại', 'danger');
          }
        });
      }
    });
  }

  updateNutrition(period: any) {
    const dialogRef = this.dialog.open(UpdateNutritionDialogComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      data: {
        period,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      const { type, status } = res;
      if (type === 'update' && status === 'fail') {
        this.commonService.openAlert(
          'Cập nhật chất dinh dưỡng thất bại',
          'danger'
        );
      } else if (type === 'update' && status === 'success') {
        this.commonService.openAlert(
          'Cập nhật chất dinh dưỡng thành công',
          'success'
        );
        this.getPeriod();
      }
    });
  }

  updatePeriod(periodId: string) {
    const dialogRef = this.dialog.open(CreateUpdatePeriodDialogComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      data: {
        periodId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const { type, status, isModified } = result;
      if (type === 'update' && status === 'success') {
        this.commonService.openAlert(
          'Cập nhật giai đoạn sinh trưởng thành công',
          'success'
        );
        this.getPeriod();
      } else if (type === 'update' && status === 'failure') {
        this.commonService.openAlert(
          'Cập nhật giai đoạn sinh trưởng thất bại',
          'danger'
        );
      } else if (type === 'close' && isModified) {
        this.getPeriod();
      } else if (type === 'close' && !isModified) {
        return;
      }
    });
  }

  onCreateMeal(period: any) {
    const dialogRef = this.dialog.open(CreateStandardMealDialogComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      data: {
        period,
      },
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data.status === 'fail') {
        this.commonService.openAlert('Thêm mới khẩu ăn chuẩn phần thất bại', 'danger');
      } else if (data.status === 'success') {
        this.commonService.openAlert('Thêm mới khẩu ăn chuẩn phần thành công', 'success');
        this.getMeals();
      }
    })
  }
}
