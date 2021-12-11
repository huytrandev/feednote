import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { AreaService, CommonService, UserService } from 'src/app/core/services';
import { User } from 'src/app/core/models';
import { DialogComponent } from 'src/app/shared';
import { CreateUpdateComponent } from '../create-update/create-update.component';
import { ResetPasswordDialogComponent } from '../reset-password-dialog/reset-password-dialog.component';
import { DELETE_DIALOG_CONFIG } from 'src/app/core/constant';
import { CREATE_UPDATE_DIALOG_CONFIG } from 'src/app/core/constant/create-update-dialog.config';
import { formatDate, getRoleName } from 'src/app/core/helpers/functions';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  user!: User;
  loading: boolean = true;
  error: boolean = false;
  userId: string = '';
  area$!: Observable<any>;
  manager$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private areaService: AreaService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.userId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getUser() {
    this.loading = true;
    this.userService
      .fetchUser(this.userId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['/not-found']))
      )
      .subscribe((res) => {
        const { status } = res;
        if (!status) {
          this.error = true;
          this.loading = false;
          return;
        }

        let data = { ...res.data };
        this.area$ = this.areaService.fetchArea(data.idArea);
        this.manager$ = this.userService.fetchUser(data.idManager);
        const user = {
          ...data,
          roleName: getRoleName(data.role),
          joinedDate: formatDate(data.createdAt)
        }
        this.user = user;
        this.loading = false;
      });
  }

  onDelete() {
    const dialogRef = this.dialog.open(DialogComponent, DELETE_DIALOG_CONFIG);

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.userService.deleteUser(this.userId).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert(
              'Xoá người dùng thành công',
              'success'
            );
            this.router.navigate(['/admin/users']);
          } else {
            this.commonService.openAlert('Xoá người dùng thất bại', 'danger');
          }
        });
      }
    });
  }

  updateUser(user: any) {
    const dialogRef = this.dialog.open(CreateUpdateComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      disableClose: true,
      data: {
        user
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      const { type, status } = res;
      if (type === 'update' && status === 'success') {
        this.commonService.openAlert('Cập nhật người dùng thành công', 'success');
        this.getUser();
      } else if (type === 'update' && status === 'failure') {
        this.commonService.openAlert('Cập nhật người dùng thất bại', 'danger');
      }
    });
  }

  resetPassword(user: any) {
    this.dialog.open(ResetPasswordDialogComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      data: {
        user
      },
    });
  }
}
