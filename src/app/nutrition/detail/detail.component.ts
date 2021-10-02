import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { CommonService, CowBreedService } from 'src/app/core/services';
import { DialogEditComponent } from '../dialog-edit/dialog-edit.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  loading: boolean = true;
  cowBreedIdParam!: string;
  nutrition: any[] = [];

  displayedColumns = ['id', 'name', 'amount', 'unit'];
  dataTableSource = [
    {
      name: 'vitamin AA',
      unit: 'g',
      amount: '21',
      idNutrition: 'jTUMRLFQr',
    },
    {
      name: 'vitamin BB2',
      unit: 'g',
      amount: '24',
      idNutrition: 'FQGzWovWw-',
    },
    {
      name: 'vitamin B2',
      unit: 'g',
      amount: '24',
      idNutrition: '1mzj-SsxkK',
    },
  ];

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
        this.nutrition = data;
        this.loading = false;
      });
  }

  editNutrition(nutritionId: string) {
    this.dialog.open(DialogEditComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '500px',
      minHeight: '200px',
      disableClose: true,
      data: {
        nutritionId,
      },
    });
  }
}
