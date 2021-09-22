import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterDto } from 'src/app/_models/filter';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { UserService } from 'src/app/_services/user.service';
import { DialogComponent } from 'src/app/_shared/dialog/dialog.component';

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
  dataTableSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'phone',
    'areaName',
    'actions',
  ];
  paramGetBreeders = {} as FilterDto;
  defaultSort = 'createdAt desc';
  defaultPageSize = 5;
  totalCount: number = 0;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.setParams(0, this.defaultPageSize, '', this.defaultSort);
    this.getBreeders();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setParams(skip: number, limit: number, search: string, sort: string) {
    this.paramGetBreeders = {
      skip,
      limit,
      search,
      sort,
    };
  }

  getBreeders(): void {
    this.loading = true;
    this.userService
      .getAllBreeders(this.paramGetBreeders)
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
      this.getBreeders();
      return;
    }

    this.setParams(0, this.defaultPageSize, input, this.defaultSort);
    this.loading = true;
    this.getBreeders();
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
    this.getBreeders();
  }

  onPagination(e: any) {
    const limit = e.pageSize;
    const skip = e.pageIndex * limit;
    this.setParams(skip, limit, '', this.defaultSort);
    this.loading = true;
    this.getBreeders();
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
        this.userService.deleteBreeder(_id).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.snackbar.openSnackBar(
              'Xoá thức ăn thành công',
              'success',
              2000
            );
            this.getBreeders();
          } else {
            this.snackbar.openSnackBar('Xoá thức ăn thất bại', 'danger', 2000);
          }
        });
      }
    });
  }
}
