import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FilterDto } from 'src/app/_models/filter';
import { AreaService } from 'src/app/_services/area.service';
import { FoodService } from 'src/app/_services/food.service';

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
  displayedColumns: string[] = ['id', 'name', 'ingredient', 'idArea', 'unit'];
  dataSource: MatTableDataSource<any>;
  resultLength = 0;
  paramsGetFoods = {} as FilterDto;
  defaultPageSize = 1;

  constructor(
    private foodService: FoodService,
    private areaService: AreaService
  ) {}

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.setParams(0, this.defaultPageSize, '');
    this.getFoods();
  }

  getFoods() {
    this.foodService.getAll(this.paramsGetFoods).subscribe((res) => {
      const { data } = res;
      this.dataSource = new MatTableDataSource(data.items);
      this.loading = false;
    });
  }

  setParams(skip: number, limit: number, search: string) {
    this.paramsGetFoods = {
      skip,
      limit,
      search,
    };
  }

  onSearch(e: any) {
    const input = (e.target as HTMLInputElement).value;

    if (input === '' || input.length === 0) {
      this.setParams(0, 0, '');
      this.loading = true;
      this.getFoods();
      return;
    }

    this.setParams(0, 0, input);
    this.loading = true;
    this.getFoods();
  }

  onSort(e: any) {
    console.log(e);
  }

  onPagination(e: any) {
    const limit = e.pageSize;
    const skip = e.pageIndex * limit;
    this.setParams(skip, limit, '');
    this.loading = true;
    this.getFoods();
  }
}
