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

import { AuthService, CommonService, FoodService } from 'src/app/core/services';
import { AdvancedFilter } from 'src/app/core/models';
import { DialogComponent } from 'src/app/shared';
import { CreateUpdateComponent } from '../create-update/create-update.component';
import { CREATE_UPDATE_DIALOG_CONFIG } from 'src/app/core/constant/create-update-dialog.config';
import { DELETE_DIALOG_CONFIG } from 'src/app/core/constant';

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
  paramsGetFoods = {} as AdvancedFilter;
  defaultPageSize = 10;
  defaultSort = 'createdAt desc';
  totalCount: number;
  timeOutInput!: any;
  currentUser!: any;

  constructor(
    private router: Router,
    private foodService: FoodService,
    private authService: AuthService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.currentUser = authService.getUserInfo();
  }

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
      .fetchFoods(this.paramsGetFoods)
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
      filter: {
        idArea: this.currentUser.idArea,
      },
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
      let sortQuery = `${active} ${direction}`;
      if (active === 'areaName') {
        sortQuery = `idArea ${direction}`;
      }
      this.setParams(skip, limit, '', sortQuery);
    }

    this.getFoods();
  }

  onPagination(e: any) {
    const limit = e.pageSize;
    const skip = e.pageIndex * limit;
    const { active, direction } = this.sort;
    let sortQuery = active ? `${active} ${direction}` : this.defaultSort;
    this.setParams(skip, limit, '', sortQuery);
    this.getFoods();
  }

  delete(element: any) {
    const dialogRef = this.dialog.open(DialogComponent, DELETE_DIALOG_CONFIG);

    const { _id } = element;

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.foodService.deleteFood(_id).subscribe((res) => {
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

  createUpdateFood(food?: any) {
    const dialogRef = this.dialog.open(CreateUpdateComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      data: {
        food,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      const { type, status, isModified } = res;
      if (type === 'create' && status === 'success') {
        this.commonService.openAlert('Tạo thức ăn thành công', 'success');
        this.getFoods();
      } else if (type === 'create' && status === 'fail') {
        this.commonService.openAlert('Tạo thức ăn thất bại', 'danger');
      } else if (type === 'update' && status === 'success') {
        this.commonService.openAlert('Cập nhật thức ăn thành công', 'success');
        this.getFoods();
      } else if (type === 'update' && status === 'fail') {
        this.commonService.openAlert('Cập nhật thức ăn thất bại', 'danger');
      } else if (type === 'close' && isModified) {
        this.getFoods();
      } else if (type === 'close' && !isModified) {
        return;
      }
    });
  }
}
