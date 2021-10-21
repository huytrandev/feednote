import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { AreaService, CommonService, UserService } from 'src/app/core/services';
import { User } from 'src/app/core/models';
import { DialogComponent } from 'src/app/shared';
import { CreateUpdateComponent } from '../create-update/create-update.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy, AfterViewInit {
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

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.getBreeder();
  }

  getBreeder() {
    this.loading = true;
    this.userService
      .fetchBreeder(this.breederId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((user) => {
          return this.areaService.fetchArea(user.data.idArea).pipe(
            map((area) => {
              return { ...user.data, areaName: area.data.name };
            })
          );
        }),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((val) => {
        this.breeder = val;
        this.loading = false;
      });
  }

  transformDate(date: number) {
    return moment(date).locale('vi').format('L');
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

  updateBreeder(breeder: any) {
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
        breeder
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      const { type, status } = res;
      if (type === 'update' && status === 'success') {
        this.commonService.openAlert('Cập nhật hộ chăn nuôi thành công', 'success');
        this.getBreeder();
      } else if (type === 'update' && status === 'failure') {
        this.commonService.openAlert('Cập nhật hộ chăn nuôi thất bại', 'danger');
      }
    });
  }
}
