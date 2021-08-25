import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AreaService } from 'src/app/_services/area.service';
import { FoodService } from 'src/app/_services/food.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = true;
  foods: any = {};
  displayedColumns: string[] = ['id', 'name', 'ingredient', 'idArea', 'unit'];
  dataSource: MatTableDataSource<any>;
  resultLength = 0;

  constructor(
    private foodService: FoodService,
    private areaService: AreaService
  ) {}

  ngOnInit(): void {
    this.getFoods();
  }

  getFoods() {
    this.foodService.getAll().subscribe((res) => {
      console.log(res);
      this.dataSource = new MatTableDataSource(res.data.items);
      this.loading = false;
    });
  }
}
