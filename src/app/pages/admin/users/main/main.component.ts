import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { AuthService, CommonService, UserService } from 'src/app/core/services';
import { User, FilterDto } from 'src/app/core/models';
import { DialogComponent } from 'src/app/shared';
import { CreateUpdateComponent } from '../create-update/create-update.component';
import { ResetPasswordDialogComponent } from '../reset-password-dialog/reset-password-dialog.component';
import { DELETE_DIALOG_CONFIG } from 'src/app/core/constant';
import { CREATE_UPDATE_DIALOG_CONFIG } from 'src/app/core/constant/create-update-dialog.config';
import { formatDate, getRoleName } from 'src/app/core/helpers/functions';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = true;
  dataTableSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['id', 'name', 'areaName', 'role', 'createdAt', 'actions'];
  paramGetUsers!: FilterDto;
  defaultSort: string = 'createdAt desc';
  defaultPageSize: number = 10;
  totalCount: number = 0;
  currentUser!: any;
  timeOutInput!: any;

  constructor(
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog,
    private commonService: CommonService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.setParams(0, this.defaultPageSize, '', this.defaultSort);
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setParams(skip: number, limit: number, search: string, sort: string) {
    this.paramGetUsers = {
      skip,
      limit,
      search,
      sort,
    };
  }

  getUsers(): void {
    this.loading = true;
    this.userService
      .fetchUsers(this.paramGetUsers)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['/not-found']))
      )
      .subscribe((res) => {
        const { status, data } = res;
        if (!status) {
          this.loading = false;
          return;
        }
        this.totalCount = data.totalCount ? data.totalCount : 0
        let users: any[] = []
        if (data && data.items && data.items.length > 0) {
          users = data.items.map((u: any) => {
            return {
              ...u,
              roleName: getRoleName(u.role),
              joinedDate: formatDate(u.createdAt)
            }
          })
        }
        
        this.dataTableSource = new MatTableDataSource(users);
        this.loading = false;
      });
  }

  onSearch(e: any) {
    clearTimeout(this.timeOutInput);
    const input = e.target.value;

    this.timeOutInput = setTimeout(() => {
      if (input === '' || input.length === 0) {
        this.setParams(0, this.defaultPageSize, '', this.defaultSort);
        this.loading = true;
        this.getUsers();
        return;
      }

      this.setParams(0, this.defaultPageSize, input, this.defaultSort);
      this.loading = true;
      this.getUsers();
    }, 500);
  }

  onSort(e: any) {
    const { active, direction } = e;

    const limit = this.paginator.pageSize;
    const skip = limit * this.paginator.pageIndex;

    if (direction === '') {
      this.setParams(skip, limit, '', this.defaultSort);
    } else {
      let sortQuery = `${active} ${direction}`;
      if (active === 'areaName') {
        sortQuery = `idArea ${direction}`;
      }
      this.setParams(skip, limit, '', sortQuery);
    }

    this.getUsers();
  }

  onPagination(e: any) {
    const limit = e.pageSize;
    const skip = e.pageIndex * limit;
    const { active, direction } = this.sort;
    let sortQuery = active ? `${active} ${direction}` : this.defaultSort;
    this.setParams(skip, limit, '', sortQuery);
    this.getUsers();
  }

  delete(element: any) {
    const dialogRef = this.dialog.open(DialogComponent, DELETE_DIALOG_CONFIG);

    const { _id } = element;

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.userService.deleteUser(_id).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert(
              'Xo?? ng?????i d??ng th??nh c??ng',
              'success'
            );
            this.getUsers();
          } else {
            this.commonService.openAlert('Xo?? ng?????i d??ng th???t b???i', 'danger');
          }
        });
      }
    });
  }

  createUpdateUser(user?: any) {
    const dialogRef = this.dialog.open(CreateUpdateComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      disableClose: true,
      data: {
        user
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      const { type, status } = res;
      if (type === 'create' && status === 'success') {
        this.commonService.openAlert('T???o ng?????i d??ng th??nh c??ng', 'success');
        this.getUsers();
      } else if (type === 'create' && status === 'failure') {
        this.commonService.openAlert('T???o ng?????i d??ng th???t b???i', 'danger');
      } else if (type === 'update' && status === 'success') {
        this.commonService.openAlert('C???p nh???t ng?????i d??ng th??nh c??ng', 'success');
        this.getUsers();
      } else if (type === 'update' && status === 'failure') {
        this.commonService.openAlert('C???p nh???t ng?????i d??ng th???t b???i', 'danger');
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
