import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  DELETE_DIALOG_CONFIG,
  INITIAL_PERIOD_NUTRITION,
} from 'src/app/core/constant';
import { CREATE_UPDATE_DIALOG_CONFIG } from 'src/app/core/constant/create-update-dialog.config';
import { formatDate, getTypeFoodName } from 'src/app/core/helpers/functions';
import {
  CommonService,
  CowBreedService,
  MealService,
  AuthService,
} from 'src/app/core/services';
import { DialogComponent } from 'src/app/shared';
import { CreateStandardMealDialogComponent } from '../create-standard-meal-dialog/create-standard-meal-dialog.component';
import { CreateUpdatePeriodDialogComponent } from '../create-update-period-dialog/create-update-period-dialog.component';
import { PreviewStandardMealDialogComponent } from '../preview-standard-meal-dialog/preview-standard-meal-dialog.component';
import { UpdateNutritionDialogComponent } from '../update-nutrition-dialog/update-nutrition-dialog.component';

@Component({
  selector: 'app-period-detail',
  templateUrl: './period-detail.component.html',
  styleUrls: ['./period-detail.component.scss'],
})
export class PeriodDetailComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  nutritionColumns = ['id', 'name', 'amountNutrition'];
  mealColumns = ['id', 'foodName', 'foodType', 'foodRatio', 'foodAmount'];
  periodId!: string;
  cowBreedId!: string;
  period!: any;
  cowBreed!: any;
  meals!: any;
  loading: boolean = true;
  isModified: boolean = false;
  allowCreateMeal: boolean = true;
  isEditing: boolean = false;
  mealEachArea: any[] = [];
  currentUser!: any;
  fetchingMeal: boolean = true

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cowBreedService: CowBreedService,
    private mealService: MealService,
    private commonService: CommonService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.periodId = this.route.snapshot.paramMap.get('id')!;
    this.cowBreedId = this.route.snapshot.paramMap.get('idCowBreed')!;
    this.currentUser = this.authService.getUserInfo();
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

        const nutrition = data.nutrition.map((n: any) => {
          const description = INITIAL_PERIOD_NUTRITION.find(
            (field: any) => field.name === n.name
          )?.description;
          return {
            ...n,
            description,
          };
        });

        const period = {
          ...data,
          nutrition
        }
        this.period = period;
        const nutritionValueZero = period.nutrition.find(
          (item: any) => item.amount === 0
        );
        this.allowCreateMeal = nutritionValueZero ? false : true;
        this.loading = false;
      });
  }

  getMeals() {
    const query = {
      filter: {
        idPeriod: this.periodId,
      },
    };
    this.fetchingMeal = true
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
        const meals = data.items.map((m: any) => {
          const foods = m.foods.map((f: any) => {
            return {
              ...f,
              type: getTypeFoodName(f.type),
            };
          });
          return {
            ...m,
            foods,
            createdAt: formatDate(m.createdAt),
          };
        });
        this.meals = meals;
        this.mealEachArea = [];
        let meal: any[] = [];
        if (this.currentUser.role === 'admin') {
          meals.forEach((m: any) => {
            if (!areas.find((a) => a === m.idArea)) {
              areas.push(m.idArea);
              let localMeal = m
              let foods = localMeal.foods.map((f: any) => {
                const ratio = (Number(f.ratio) * 100).toFixed(2)
                return {
                  ...f,
                  ratio: Number(ratio)
                }
              })
              localMeal = {
                ...localMeal,
                foods
              }
              this.mealEachArea.push(localMeal);
            }
          });
        } else {
          meal = meals
            .filter((item: any) => item.idArea === this.currentUser.idArea)
            .slice(0, 1)
          meal = meal.map((m: any) => {
            const foods = m.foods.map((f: any) => {
              const ratio = (Number(f.ratio) * 100).toFixed(2)
              return {
                ...f,
                ratio: Number(ratio)
              }
            })
            return {
              ...m,
              foods
            }
          })
          this.mealEachArea = meal
        }
      });
      this.fetchingMeal = false
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
            this.commonService.openAlert('Xo?? giai ??o???n th??nh c??ng', 'success');
            this.router.navigate(['/cow-breeds', this.cowBreedId]);
          } else {
            this.commonService.openAlert('Xo?? giai ??o???n th???t b???i', 'danger');
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
                'Xo?? th??nh ph???n dinh d?????ng th??nh c??ng',
                'success'
              );
              this.getPeriod();
            } else {
              this.commonService.openAlert(
                'Xo?? th??nh ph???n dinh d?????ng th???t b???i',
                'danger'
              );
            }
          });
      }
    });
  }

  onDeleteFoodOfMeal(mealId: string, foodId: string) {
    const dialogRef = this.dialog.open(DialogComponent, DELETE_DIALOG_CONFIG);

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.mealService.deleteFood(mealId, foodId).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert('Xo?? th???c ??n th??nh c??ng', 'success');
            this.getMeals();
          } else {
            this.commonService.openAlert('Xo?? th???c ??n th???t b???i', 'danger');
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
          'C???p nh???t ch???t dinh d?????ng th???t b???i',
          'danger'
        );
      } else if (type === 'update' && status === 'success') {
        this.commonService.openAlert(
          'C???p nh???t ch???t dinh d?????ng th??nh c??ng',
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
          'C???p nh???t giai ??o???n sinh tr?????ng th??nh c??ng',
          'success'
        );
        this.getPeriod();
      } else if (type === 'update' && status === 'failure') {
        this.commonService.openAlert(
          'C???p nh???t giai ??o???n sinh tr?????ng th???t b???i',
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
    if (!this.allowCreateMeal) {
      this.commonService.openAlert(
        'Nhu c???u dinh d?????ng ch??a ph?? h???p',
        'warning'
      );
      return;
    }
    const dialogRef = this.dialog.open(CreateStandardMealDialogComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      data: {
        period,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      const { status } = res;
      if (status === 'fail') {
        //
      } else if (status === 'success') {
        const { data } = res;
        const previewMealDialog = this.dialog.open(
          PreviewStandardMealDialogComponent,
          {
            ...CREATE_UPDATE_DIALOG_CONFIG,
            width: '50%',
            maxWidth: '700px',
            data: {
              ...data,
              idPeriod: this.period._id,
            },
          }
        );

        previewMealDialog.afterClosed().subscribe((res) => {
          if (res.status === 'fail') {
            this.commonService.openAlert(
              'L??u kh???u ph???n ??n chu???n th???t b???i',
              'danger'
            );
          } else if (res.status === 'success') {
            this.commonService.openAlert(
              'L??u kh???u ph???n ??n chu???n th??nh c??ng',
              'success'
            );
            this.getMeals();
          }
        });
      }
    });
  }
}
