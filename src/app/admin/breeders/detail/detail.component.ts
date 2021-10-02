import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';

import { AreaService, CommonService, UserService } from 'src/app/core/services';
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
  areaName!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private areaService: AreaService,
    public dialog: MatDialog,
    private commonService: CommonService
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
    this.userService.getBreederById(this.breederId).pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap((user) => {
        return this.areaService.getById(user.data.idArea).pipe(
          map((area) => {
            return { ...user.data, areaName: area.data.name };
          })
        );
      }),
      catchError((_) => this.router.navigate(['not-found']))
    )
    .subscribe(val => {
      this.breeder = val;
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
            this.commonService.openAlert('Xoá thức ăn thành công', 'success');
            this.router.navigate(['/breeders']);
          } else {
            this.commonService.openAlert('Xoá thức ăn thất bại', 'danger');
          }
        });
      }
    });
  }
}
