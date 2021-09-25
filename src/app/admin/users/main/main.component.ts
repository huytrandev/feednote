import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, FilterDto, SnackbarService, User, UserService } from 'src/app/core';
import { DialogComponent } from 'src/app/shared';

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
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'phone',
    'role',
    'actions',
  ];
  paramGetUsers!: FilterDto;
  defaultSort: string = 'createdAt desc';
  defaultPageSize: number = 10;
  totalCount: number = 0;
  currentUser!: any;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private snackbar: SnackbarService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getUserByToken();
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
      .getAllUsers(this.paramGetUsers)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { status, data } = res;
        if (!status) {
          this.loading = false;
          return;
        }
        this.totalCount = data.totalCount;

        this.dataTableSource = new MatTableDataSource(data.items);
        this.loading = false;
      });
  }

  onSearch(e: any) {
    const input = e.target.value;

    if (input === '' || input.length === 0) {
      this.setParams(0, this.defaultPageSize, '', this.defaultSort);
      this.loading = true;
      this.getUsers();
      return;
    }

    this.setParams(0, this.defaultPageSize, input, this.defaultSort);
    this.loading = true;
    this.getUsers();
  }

  onSort(e: any) {
    const { active, direction } = e;

    const limit = this.paginator.pageSize;
    const skip = limit * this.paginator.pageIndex;

    if (direction === '') {
      this.setParams(skip, limit, '', this.defaultSort);
    } else {
      const sortQuery = `${active} ${direction}`;
      this.setParams(skip, limit, '', sortQuery);
    }

    this.loading = true;
    this.getUsers();
  }

  onPagination(e: any) {
    const limit = e.pageSize;
    const skip = e.pageIndex * limit;
    this.setParams(skip, limit, '', this.defaultSort);
    this.loading = true;
    this.getUsers();
  }

  delete(element: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      disableClose: true,
    });

    const { _id } = element;

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.userService.deleteUser(_id).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.snackbar.openSnackBar(
              'Xoá người dùng thành công',
              'success',
              2000
            );
            this.getUsers();
          } else {
            this.snackbar.openSnackBar('Xoá người dùng thất bại', 'danger', 2000);
          }
        });
      }
    });
  }

  transformRole(role: string) {
    if (role === 'admin') {
      return 'Quản trị viên';
    } else if (role === 'manager') {
      return 'Cán bộ thú y';
    } else {
      return 'Hộ nông dân';
    }
  }
}
