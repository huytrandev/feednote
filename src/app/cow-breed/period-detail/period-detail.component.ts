import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { CommonService, CowBreedService } from 'src/app/core/services';
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
  nutritionColumns = ['id', 'name', 'amount', 'unit', 'actions'];
  foodColumns = ['id', 'name', 'amount', 'unit'];
  periodId!: string;
  cowBreedId!: string;
  period!: any;
  cowBreed$: Observable<any>;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cowBreedService: CowBreedService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.periodId = this.route.snapshot.paramMap.get('id')!;
    this.cowBreedId = this.route.snapshot.paramMap.get('idCowBreed')!;
  }

  ngOnInit(): void {
    this.getPeriod();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onNavigate(event: any) {
    console.log(event.target.value);
  }

  getPeriod(): void {
    this.loading = true;
    this.cowBreedService
      .getPeriod(this.periodId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((res) => {
        const { status, data } = res;
        if (!status) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.cowBreed$ = this.cowBreedService.getById(this.cowBreedId);
        this.period = data;
        this.loading = false;
      });
  }

  onDeletePeriod() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      disableClose: true,
      autoFocus: false,
    });

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
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.cowBreedService
          .deleteNutrition(periodId, nutritionId)
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
      autoFocus: false,
      restoreFocus: false,
      width: '550px',
      minHeight: '200px',
      maxHeight: '100vh',
      disableClose: true,
      data: {
        periodId,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      const { type, status } = res;
      if (type === 'create' && status === 'fail') {
        this.commonService.openAlert('Thêm chất dinh dưỡng thất bại', 'danger');
      } else if (type === 'create' && status === 'success') {
        this.commonService.openAlert('Thêm chất dinh dưỡng thành công', 'success');
        this.getPeriod();
      } else {
        return;
      }
    });
  }

  updateNutrition(periodId: string, nutrition: any) {
    const dialogRef = this.dialog.open(DialogUpdateNutritionComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '500px',
      minHeight: '200px',
      disableClose: true,
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
