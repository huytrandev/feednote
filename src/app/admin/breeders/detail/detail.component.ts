import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { AreaService, SnackbarService, UserService } from 'src/app/core/services';
import { User } from 'src/app/core/models';
import { DialogComponent } from 'src/app/shared';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  breeder!: User;
  loading: boolean = true;
  error: boolean = false;
  breederId!: string;
  area$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private areaService: AreaService,
    public dialog: MatDialog,
    private snackbar: SnackbarService
  ) {
    this.breederId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.getBreeder();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getBreeder() {
    this.loading = true;
    this.userService
      .getBreederById(this.breederId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((res) => {
        const { status } = res;
        if (!status) {
          this.error = true;
          this.loading = false;
          return;
        }

        let data = { ...res.data };
        this.area$ = this.areaService.getById(data.idArea);
        this.breeder = data;
        this.loading = false;
      });
  }

  transformDate(date: number) {
    return new Date(date);
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
        this.userService.deleteBreeder(this.breederId).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.snackbar.openSnackBar(
              'Xoá thức ăn thành công',
              'success',
              2000
            );
            this.router.navigate(['/breeders']);
          } else {
            this.snackbar.openSnackBar('Xoá thức ăn thất bại', 'danger', 2000);
          }
        });
      }
    });
  }
}
