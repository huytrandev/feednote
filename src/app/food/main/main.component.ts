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

import { CommonService, FoodService } from 'src/app/core/services';
import { FilterDto } from 'src/app/core/models';
import { DialogComponent } from 'src/app/shared';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  loading: boolean = true;
  foods: any = {};
  displayedColumns: string[] = ['id', 'name', 'areaName', 'actions'];
  dataTableSource: MatTableDataSource<any>;
  resultLength = 0;
  paramsGetFoods = {} as FilterDto;
  defaultPageSize = 10;
  defaultSort = 'createdAt desc';
  totalCount: number;
  timeOutInput!: any;

  constructor(
    private router: Router,
    private foodService: FoodService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setParams(0, this.defaultPageSize, '', this.defaultSort);
    this.getFoods();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getFoods() {
    this.loading = true;
    this.foodService
      .getAll(this.paramsGetFoods)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((res) => {
        const { data } = res;
        this.totalCount = data.totalCount;
        this.dataTableSource = new MatTableDataSource(data.items);
        this.loading = false;
      });
  }

  setParams(skip: number, limit: number, search: string, sort: string) {
    this.paramsGetFoods = {
      skip,
      limit,
      search,
      sort,
    };
  }

  onSearch(e: any) {
    clearTimeout(this.timeOutInput);
    const input = e.target.value;

    this.timeOutInput = setTimeout(() => {
      if (input === '' || input.length === 0) {
        this.setParams(0, this.defaultPageSize, '', this.defaultSort);
        this.getFoods();
        return;
      }

      this.setParams(0, this.defaultPageSize, input, this.defaultSort);
      this.getFoods();
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

    this.getFoods();
  }

  onPagination(e: any) {
    const limit = e.pageSize;
    const skip = e.pageIndex * limit;
    const { active, direction } = this.sort;
    const currentSort = `${active} ${direction}`;
    this.setParams(skip, limit, '', currentSort);
    this.getFoods();
  }

  delete(element: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      disableClose: true,
      autoFocus: false,
    });

    const { _id } = element;

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.foodService.delete(_id).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert('Xoá thức ăn thành công', 'success');
            this.getFoods();
          } else {
            this.commonService.openAlert('Xoá thức ăn thất bại', 'danger');
          }
        });
      }
    });
  }
}
