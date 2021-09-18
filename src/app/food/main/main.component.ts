import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterDto } from 'src/app/_models/filter';
import { FoodService } from 'src/app/_services/food.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { DialogComponent } from 'src/app/_shared/dialog/dialog.component';
import { DialogFormComponent } from '../dialog-form/dialog-form.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  loading: boolean = true;
  foods: any = {};
  displayedColumns: string[] = ['id', 'name', 'areaName', 'unit', 'actions'];
  dataTableSource: MatTableDataSource<any>;
  resultLength = 0;
  paramsGetFoods = {} as FilterDto;
  defaultPageSize = 5;
  defaultSort = 'createdAt desc';
  totalCount: number;
  expandedElement: any | null;

  constructor(
    private foodService: FoodService,
    public dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setParams(0, this.defaultPageSize, '', this.defaultSort);
    this.getFoods();
  }

  ngOnDestroy(): void {
    // This aborts all HTTP requests.
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();
  }

  getFoods() {
    this.foodService
      .getAll(this.paramsGetFoods)
      .pipe(takeUntil(this.ngUnsubscribe))
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
    const input = e.target.value;

    if (input === '' || input.length === 0) {
      this.setParams(0, this.defaultPageSize, '', this.defaultSort);
      this.loading = true;
      this.getFoods();
      return;
    }

    this.setParams(0, this.defaultPageSize, input, this.defaultSort);
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
            this.snackbar.openSnackBar('Thêm thức ăn thất bại', 'danger', 2000);
          }
        });
      } else if (action === 'edit') {
        this.loading = true;
        const { _id } = obj;
        this.foodService.update(_id, data).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.snackbar.openSnackBar(
              'Cập nhật thức ăn thành công',
              'success',
              2000
            );
            this.getFoods();
          } else {
            this.snackbar.openSnackBar(
              'Cập nhật thức ăn thất bại',
              'danger',
              2000
            );
          }
        });
      }
    });
  }

  delete(element: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
    });

    const { _id } = element;

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.foodService.delete(_id).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.snackbar.openSnackBar(
              'Xoá thức ăn thành công',
              'success',
              2000
            );
            this.getFoods();
          } else {
            this.snackbar.openSnackBar('Xoá thức ăn thất bại', 'danger', 2000);
          }
        });
      }
    });
  }
}
