import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { AdvancedFilter } from 'src/app/core/models';
import { CommonService, FeedingDiaryService } from 'src/app/core/services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = true;
  dataTableSource: MatTableDataSource<any>;
  defaultSort: string = 'createdAt desc';
  defaultPageSize: number = 10;
  totalCount: number = 0;
  fromParams = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    .toISOString()
    .substring(0, 10);
  toParams = new Date(Date.now()).toISOString().substring(0, 10);
  params: AdvancedFilter;
  displayedColumns = ['id', 'createdDate', 'actions'];

  constructor(
    private router: Router,
    private feedingDiaryService: FeedingDiaryService,
    public dialog: MatDialog,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.setParams(0 , this.defaultPageSize, '', this.defaultSort, this.fromParams, this.toParams);
    this.getFeedingDiaries();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setParams(
    skip: number,
    limit: number,
    search: string,
    sort: string,
    from?: string,
    to?: string
  ) {
    this.params = {
      skip,
      limit,
      search,
      sort,
      from,
      to,
    };
  }

  getFeedingDiaries() {
    this.loading = true;
    this.feedingDiaryService
      .getAll(this.params)
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

        this.dataTableSource = new MatTableDataSource(data.items);
        this.loading = false;
      });
  }

  onSearch(e: any) {}

  onSort(e: any) {}

  onPagination(e: any) {}

  transformDate(date: number) {
    return new Date(date);
  }
}
