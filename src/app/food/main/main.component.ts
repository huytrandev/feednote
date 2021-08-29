import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FilterDto } from 'src/app/_models/filter';
import { FoodService } from 'src/app/_services/food.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { DialogComponent } from 'src/app/_shared/dialog/dialog.component';
import { DialogFormComponent } from '../dialog-form/dialog-form.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = true;
  foods: any = {};
  displayedColumns: string[] = ['id', 'name', 'idArea', 'unit', 'actions'];
  dataTableSource: MatTableDataSource<any>;
  resultLength = 0;
  paramsGetFoods = {} as FilterDto;
  defaultPageSize = 5;
  defaultSort = 'createdAt desc';
  totalCount: number;

  constructor(
    private foodService: FoodService,
    public dialog: MatDialog,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setParams(0, this.defaultPageSize, '', this.defaultSort);
    this.getFoods();
  }

  getFoods() {
    this.foodService.getAll(this.paramsGetFoods).subscribe((res) => {
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
    const input = (e.target as HTMLInputElement).value;

    if (input === '' || input.length === 0) {
      this.setParams(0, 0, '', '');
      this.loading = true;
      this.getFoods();
      return;
    }

    this.setParams(0, 0, input, this.defaultSort);
    this.loading = true;
    this.getFoods();
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
    this.getFoods();
  }

  onPagination(e: any) {
    const limit = e.pageSize;
    const skip = e.pageIndex * limit;
    this.setParams(skip, limit, '', this.defaultSort);
    this.loading = true;
    this.getFoods();
  }

  openDialog(action: string, obj: any) {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '500px',
      minHeight: '200px',
      data: {
        action,
        obj,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const { action, data } = result;
      if (action === 'add') {
        this.loading = true;
        this.foodService.create(data).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.snackbar.openSnackBar(
              'Thêm thức ăn thành công',
              'success',
              2000
            );
            this.getFoods();
          } else {
            this.snackbar.openSnackBar(
              'Thêm thức ăn thất bại',
              'danger',
              2000
            );
          }
        });
      } else if (action === 'edit') {
        this.loading = true;
        const { _id } = obj;
        this.foodService.update(_id, data).subscribe(res => {
          const { status } = res;
          if (status === true) {
            this.snackbar.openSnackBar('Cập nhật thức ăn thành công', 'success', 2000);
            this.getFoods();
          } else {
            this.snackbar.openSnackBar('Cập nhật thức ăn thất bại', 'danger', 2000);
          }
        })
      }
    });
  }

  delete(element: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
    });

    const { _id } = element;

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.foodService.delete(_id).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.snackbar.openSnackBar('Xoá thức ăn thành công', 'success', 2000);
            this.getFoods();
          } else {
            this.snackbar.openSnackBar(
              'Xoá thức ăn thất bại',
              'danger',
              2000
            );
          }
        });
      }
    });
  }
}
