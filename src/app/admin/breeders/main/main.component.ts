import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { CommonService, UserService } from 'src/app/core/services';
import { FilterDto, User } from 'src/app/core/models';
import { DialogComponent } from 'src/app/shared';
import { CreateUpdateComponent } from '../create-update/create-update.component';
import { CREATE_UPDATE_DIALOG_CONFIG } from 'src/app/core/constant/create-update-dialog.config';
import { DELETE_DIALOG_CONFIG } from 'src/app/core/constant';
import { formatDate } from 'src/app/core/helpers/functions';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = true;
  dataTableSource: MatTableDataSource<User>;
  displayedColumns: string[] = [
    'id',
    'name',
    'areaName',
    'createdAt',
    'actions',
  ];
  paramGetBreeders!: FilterDto;
  defaultSort = 'createdAt desc';
  defaultPageSize = 10;
  totalCount: number = 0;

  timeOutInput!: any;

  constructor(
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.setParams(0, this.defaultPageSize, '', this.defaultSort);
    this.getBreeders();
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
      .fetchBreeders(this.paramGetBreeders)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((res) => {
        const { status, data } = res;
        if (!status) {
          this.loading = false;
          return;
        }
        this.totalCount = data.totalCount;
        const breeders = data.items.map((b: any) => {
          return {
            ...b,
            joinedDate: formatDate(b.createdAt)
          }
        })
        this.dataTableSource = new MatTableDataSource(breeders);
        this.loading = false;
      });
  }

  onSearch(e: any) {
    clearTimeout(this.timeOutInput);
    const input = e.target.value;

    this.timeOutInput = setTimeout(() => {
      if (input === '' || input.length === 0) {
        this.setParams(0, this.defaultPageSize, '', this.defaultSort);
        this.getBreeders();
        return;
      }

      this.setParams(0, this.defaultPageSize, input, this.defaultSort);
      this.getBreeders();
    }, 500);
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
    const { active, direction } = this.sort;
    let sortQuery = active ? `${active} ${direction}` : this.defaultSort;
    this.setParams(skip, limit, '', sortQuery);
    this.loading = true;
    this.getBreeders();
  }

  delete(element: any) {
    const dialogRef = this.dialog.open(DialogComponent, DELETE_DIALOG_CONFIG);

    const { _id } = element;

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.userService.deleteBreeder(_id).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert('Xoá hộ chăn nuôi thành công', 'success');
            this.getBreeders();
          } else {
            this.commonService.openAlert('Xoá hộ chăn nuôi thất bại', 'danger');
          }
        });
      }
    });
  }

  createUpdateBreeder(breeder?: any) {
    const dialogRef = this.dialog.open(CreateUpdateComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      data: {
        breeder
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      const { type, status } = res;
      if (type === 'create' && status === 'success') {
        this.commonService.openAlert('Tạo hộ chăn nuôi thành công', 'success');
        this.getBreeders();
      } else if (type === 'create' && status === 'failure') {
        this.commonService.openAlert('Tạo hộ chăn nuôi thất bại', 'danger');
      } else if (type === 'update' && status === 'success') {
        this.commonService.openAlert('Cập nhật hộ chăn nuôi thành công', 'success');
        this.getBreeders();
      } else if (type === 'update' && status === 'failure') {
        this.commonService.openAlert('Cập nhật hộ chăn nuôi thất bại', 'danger');
      }
    });
  }
}
