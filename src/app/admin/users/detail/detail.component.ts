import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
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
      .getUserById(this.userId)
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
        this.manager$ = this.userService.getUserById(data.idManager);
        this.user = data;
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
        this.userService.deleteUser(this.userId).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert(
              'Xoá người dùng thành công',
              'success'
            );
            this.router.navigate(['/breeders']);
          } else {
            this.commonService.openAlert('Xoá người dùng thất bại', 'danger');
          }
        });
      }
    });
  }

  transformDate(date: number) {
    return moment(date).locale('vi').format('LL');
  }

  transformRoleName(role: string) {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'manager':
        return 'Cán bộ thú y';
      case 'breeder':
        return 'Hộ nông dân';
      default:
        return 'Hộ nông dân';
    }
  }
}
