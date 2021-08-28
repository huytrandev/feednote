import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FilterDto } from 'src/app/_models/filter';
import { FoodService } from 'src/app/_services/food.service';
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
  totalCount: number;

  constructor(private foodService: FoodService, public dialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setParams(0, this.defaultPageSize, '', '');
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

    this.setParams(0, 0, input, '');
    this.loading = true;
    this.getFoods();
  }

  onSort(e: any) {
    const { active, direction } = e;

    const limit = this.paginator.pageSize;
    const skip = limit * this.paginator.pageIndex;

    if (direction === '') {
      this.setParams(skip, limit, '', '');
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
    this.setParams(skip, limit, '', '');
    this.loading = true;
    this.getFoods();
  }

  openDialog(type: string, obj?: any) {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '500px',
      minHeight: '200px',
      data: {
        type,
      },
    });
  }

  delete() {
    this.dialog.open(DialogComponent, {
      width: '500px',
    });
  }
}
