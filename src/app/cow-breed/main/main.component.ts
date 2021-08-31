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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterDto } from 'src/app/_models/filter';
import { CowBreedService } from 'src/app/_services/cow-breed.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = true;
  cowBreeds: any = {};
  dataTableSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'id',
    'name',
    'farmingTime',
    'actions',
  ];
  defaultPageSize = 5;
  paramsGetCowBreeds = {} as FilterDto;
  defaultSort = 'createdAt desc';
  totalCount: number;

  constructor(
    private snackbar: SnackbarService,
    public dialog: MatDialog,
    private cowBreedService: CowBreedService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setParams(0, this.defaultPageSize, '', this.defaultSort);
    this.getCowBreeds();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setParams(skip: number, limit: number, search: string, sort: string) {
    this.paramsGetCowBreeds = {
      skip,
      limit,
      search,
      sort,
    };
  }

  getCowBreeds(): void {
    this.cowBreedService
      .getAll(this.paramsGetCowBreeds)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { data } = res;
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
      this.getCowBreeds();
      return;
    }

    this.setParams(0, this.defaultPageSize, input, this.defaultSort);
    this.loading = true;
    this.getCowBreeds();
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
    this.getCowBreeds();
  }

  onPagination(e: any) {
    const limit = e.pageSize;
    const skip = e.pageIndex * limit;
    this.setParams(skip, limit, '', this.defaultSort);
    this.loading = true;
    this.getCowBreeds();
  }

  
}
