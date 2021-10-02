import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import {
  CommonService,
  CowBreedService,
} from 'src/app/core/services';
import { DialogComponent } from 'src/app/shared';
import { NutritionDialogComponent } from '../nutrition-dialog/nutrition-dialog.component';

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
    this.loading = true;
    this.getCowBreed();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getCowBreed(): void {
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

  showNutrition(periodId: string) {
    const dialogRef = this.dialog.open(NutritionDialogComponent, {
      autoFocus: false,
      width: '70%',
      minWidth: '750px',
      maxWidth: '1700px',
      minHeight: '500px',
      maxHeight: '500px',
      restoreFocus: false,
      data: {
        periodId,
      },
    });
    // this.periodService
    //   .getNutritionByPeriod(periodId)
    //   .pipe(
    //     takeUntil(this.ngUnsubscribe),
    //     catchError((_) => this.router.navigate(['not-found']))
    //   )
    //   .subscribe((res) => {});
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
}
