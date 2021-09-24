import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CowBreedService, SnackbarService } from 'src/app/core';
import { DialogComponent } from 'src/app/shared';

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
    private snackbar: SnackbarService,
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
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        const { status } = response;
        if (!status) {
          this.loading = false;
          this.error = true;
          return;
        }
        const { data } = response;
        this.cowBreed = data;
        this.loading = false;
      });
  }

  onDelete() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.cowBreedService.delete(this.cowBreed._id).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.snackbar.openSnackBar(
              'Xoá giống bò thành công',
              'success',
              2000
            );
            this.router.navigate(['/cow-breeds']);
          } else {
            this.snackbar.openSnackBar('Xoá giống bò thất bại', 'danger', 2000);
          }
        });
      }
    });
  }
}
