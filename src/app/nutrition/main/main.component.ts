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
import { FilterDto } from 'src/app/core/models';
import { CommonService, CowBreedService } from 'src/app/core/services';

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
  dataTableSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'cowBreedName', 'actions'];
  params!: FilterDto;
  defaultSort = 'createdAt desc';
  defaultPageSize = 10;
  totalCount: number = 0;
  timeOutInput!: any;

  constructor(
    public dialog: MatDialog,
    private commonService: CommonService,
    private cowBreedService: CowBreedService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.setParams(0, this.defaultPageSize, '', this.defaultSort);
    this.getCowBreeds();
  }

  setParams(skip: number, limit: number, search: string, sort: string) {
    this.params = {
      skip,
      limit,
      search,
      sort,
    };
  }

  getCowBreeds(): void {
    this.cowBreedService
      .getAll(this.params)
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

  onSearch(e: any) {
    clearTimeout(this.timeOutInput);
    const input = e.target.value;

    this.timeOutInput = setTimeout(() => {
      if (input === '' || input.length === 0) {
        this.setParams(0, this.defaultPageSize, '', this.defaultSort);
        this.loading = true;
        this.getCowBreeds();
        return;
      }

      this.setParams(0, this.defaultPageSize, input, this.defaultSort);
      this.loading = true;
      this.getCowBreeds();
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
    this.getCowBreeds();
  }

  onPagination(e: any) {
    const limit = e.pageSize;
    const skip = e.pageIndex * limit;
    this.setParams(skip, limit, '', this.defaultSort);
    this.loading = true;
    this.getCowBreeds();
  }
  
  onDelete($element: any) {}
}
