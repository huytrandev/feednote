import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { CommonService, CowBreedService } from 'src/app/core/services';
import { DialogCreateNutritionComponent } from '../dialog-create-nutrition/dialog-create-nutrition.component';
import { DialogUpdateNutritionComponent } from '../dialog-update-nutrition/dialog-update-nutrition.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  loading: boolean = true;
  cowBreedIdParam!: string;
  periods: any[] = [];
  cowBreed$!: Observable<any>;

  displayedColumns = ['id', 'name', 'amount', 'unit'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private cowBreedService: CowBreedService,
    public dialog: MatDialog
  ) {
    this.cowBreedIdParam = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.cowBreed$ = this.cowBreedService.getById(this.cowBreedIdParam);
    this.getNutrition();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getNutrition() {
    this.loading = true;
    this.cowBreedService
      .getNutritionByCowBreed(this.cowBreedIdParam)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map((res) => {
          if (!res.status) {
            return null;
          }
          return res.data;
        }),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((data) => {
        this.periods = data;
        this.loading = false;
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
        this.commonService.reloadComponent();
      }
    });
  }
}
