import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { CommonService, CowBreedService } from 'src/app/core/services';
import { DialogComponent } from 'src/app/shared';
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
  displayedColumns = ['id', 'name', 'amount', 'unit', 'actions'];

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
      .getById(this.cowBreedIdParam)
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
        this.cowBreedService.delete(this.cowBreed._id).subscribe((res) => {
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
}
