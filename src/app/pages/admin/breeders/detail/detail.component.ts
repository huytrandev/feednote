import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';

import { AreaService, CommonService, UserService } from 'src/app/core/services';
import { User } from 'src/app/core/models';
import { DialogComponent } from 'src/app/shared';
import { CreateUpdateComponent } from '../create-update/create-update.component';
import { DELETE_DIALOG_CONFIG } from 'src/app/core/constant';
import { CREATE_UPDATE_DIALOG_CONFIG } from 'src/app/core/constant/create-update-dialog.config';
import { formatDate } from 'src/app/core/helpers/functions';

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
        catchError((_) => this.router.navigate(['/not-found']))
      )
      .subscribe((val) => {
        const breeder = {
          ...val,
          joinedDate: formatDate(val.createdAt)
        }
        this.breeder = breeder;
        this.loading = false;
      });
  }

  onDelete() {
    const dialogRef = this.dialog.open(DialogComponent, DELETE_DIALOG_CONFIG);

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.userService.deleteBreeder(this.breederId).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert('Xo?? h??? ch??n nu??i th??nh c??ng', 'success');
            this.router.navigate(['/admin/farmers']);
          } else {
            this.commonService.openAlert('Xo?? h??? ch??n nu??i th???t b???i', 'danger');
          }
        });
      }
    });
  }

  updateBreeder(breeder: any) {
    const dialogRef = this.dialog.open(CreateUpdateComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      data: {
        breeder
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      const { type, status } = res;
      if (type === 'update' && status === 'success') {
        this.commonService.openAlert('C???p nh???t h??? ch??n nu??i th??nh c??ng', 'success');
        this.getBreeder();
      } else if (type === 'update' && status === 'failure') {
        this.commonService.openAlert('C???p nh???t h??? ch??n nu??i th???t b???i', 'danger');
      }
    });
  }
}
