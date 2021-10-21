import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { CommonService, CowBreedService } from 'src/app/core/services';
import { DialogComponent } from 'src/app/shared';
import { CreateUpdateComponent } from '../create-update/create-update.component';
import { DialogCreateNutritionComponent } from '../dialog-create-nutrition/dialog-create-nutrition.component';
import { DialogUpdateNutritionComponent } from '../dialog-update-nutrition/dialog-update-nutrition.component';

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
        this.cowBreedService.deleteCowBreed(this.cowBreed._id).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert('Xoá giống bò thành công', 'success');
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

    dialogRef.afterClosed().subscribe((data) => {
      if (data.success) {
        this.commonService.reloadComponent();
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
        this.getCowBreed();
      }
    });
  }

  getStandardServing() {
    // this.cowBreedService
    //   .fetchStandardServingFile(this.cowBreedIdParam)
    //   .subscribe((res) => {
    //     const blob = new Blob([res], { type: 'application/pdf' });
    //     var downloadURL = window.URL.createObjectURL(res);
    //     var link = document.createElement('a');
    //     link.href = downloadURL;
    //     link.download = 'khau-phan-an-chuan.pdf';
    //     link.click();
    //   });
  }

  updateCowBreed(cowBreedId: string) {
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
        cowBreedId,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      const { type, status } = res;
      if (type === 'update' && status === 'success') {
        this.commonService.openAlert('Cập nhật giống bò thành công', 'success');
        this.getCowBreed();
      } else if (type === 'update' && status === 'failure') {
        this.commonService.openAlert('Cập nhật giống bò thất bại', 'danger');
      }
    });
  }

  removePeriod(period: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
    });

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
            this.commonService.openAlert('Xoá giai đoạn sinh trưởng thất bại', 'danger');
          }
        });
      }
    });
  }
}
