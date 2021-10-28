import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { DELETE_DIALOG_CONFIG } from 'src/app/core/constant';
import { CREATE_UPDATE_DIALOG_CONFIG } from 'src/app/core/constant/create-update-dialog.config';

import { CommonService, CowBreedService } from 'src/app/core/services';
import { DialogComponent } from 'src/app/shared';
import { CreateUpdatePeriodDialogComponent } from '../create-update-period-dialog/create-update-period-dialog.component';
import { CreateUpdateComponent } from '../create-update/create-update.component';
import { DownloadStandardServingDialogComponent } from '../download-standard-serving-dialog/download-standard-serving-dialog.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  isEditing: boolean = false;
  type: string = 'detail';
  periodItems: any[] = [];
  cowBreed: any = {};
  loading: boolean = true;
  error: boolean = false;
  cowBreedIdParam!: string;
  periodColumns = ['id', 'name', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cowBreedService: CowBreedService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.cowBreedIdParam = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.getCowBreed();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getCowBreed(): void {
    this.loading = true;
    this.cowBreedService
      .fetchCowBreed(this.cowBreedIdParam)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map((res) => {
          const { status } = res;
          if (!status) {
            return { data: null };
          }
          const { data } = res;
          return { data };
        }),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((value: any) => {
        this.cowBreed = value.data;
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
        this.cowBreedService
          .deleteCowBreed(this.cowBreed._id)
          .subscribe((res) => {
            const { status } = res;
            if (status === true) {
              this.commonService.openAlert(
                'Xoá giống bò thành công',
                'success'
              );
              this.router.navigate(['/cow-breeds']);
            } else {
              this.commonService.openAlert('Xoá giống bò thất bại', 'danger');
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
          .deleteNutritionOfPeriod(periodId, nutritionId)
          .subscribe((res) => {
            const { status } = res;
            if (status === true) {
              this.commonService.openAlert(
                'Xoá thành phần dinh dưỡng thành công',
                'success'
              );
              this.getCowBreed();
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
        this.getCowBreed();
      } else if (type === 'update' && status === 'failure') {
        this.commonService.openAlert(
          'Cập nhật giai đoạn sinh trưởng thất bại',
          'dnager'
        );
      } else if (type === 'close' && isModified) {
        this.getCowBreed();
      } else if (type === 'close' && !isModified) {
        return;
      }
    });
  }

  getStandardServing(cowBreed: any) {
    const dialogRef = this.dialog.open(
      DownloadStandardServingDialogComponent,
      {
        ...CREATE_UPDATE_DIALOG_CONFIG,
        data: {
          cowBreed
        }
      }
    );
  }

  updateCowBreed(cowBreedId: string) {
    const dialogRef = this.dialog.open(CreateUpdateComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      data: {
        cowBreedId,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      const { type, status, isModified } = res;
      if (type === 'update' && status === 'success') {
        this.commonService.openAlert('Cập nhật giống bò thành công', 'success');
        this.getCowBreed();
      } else if (type === 'update' && status === 'failure') {
        this.commonService.openAlert('Cập nhật giống bò thất bại', 'danger');
      } else if (type === 'close' && isModified) {
        this.getCowBreed();
      } else if (type === 'close' && !isModified) {
        return;
      }
    });
  }

  removePeriod(period: any) {
    const dialogRef = this.dialog.open(DialogComponent, DELETE_DIALOG_CONFIG);

    const { _id } = period;

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.cowBreedService.deletePeriod(_id).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert(
              'Xoá giai đoạn sinh trưởng thành công',
              'success'
            );
            this.getCowBreed();
          } else {
            this.commonService.openAlert(
              'Xoá giai đoạn sinh trưởng thất bại',
              'danger'
            );
          }
        });
      }
    });
  }
}
