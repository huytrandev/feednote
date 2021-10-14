import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { AdvancedFilter, User } from 'src/app/core/models';
import {
  CommonService,
  FeedingDiaryService,
  UserService,
} from 'src/app/core/services';

import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DetailComponent } from '../detail/detail.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataTableSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'idCow', 'createdAt'];
  loading: boolean = true;
  loadingFilter: boolean = true;
  isLoadMore: boolean = false;
  defaultSort: string = 'createdAt desc';
  defaultPageSize: number = 10;
  totalCount: number = 0;
  params: AdvancedFilter;
  diaries: any;
  isShowAdvancedFilter: boolean = false;
  dateRange = new FormGroup({
    from: new FormControl({ value: '', disabled: true }, Validators.required),
    to: new FormControl({ value: '', disabled: true }, Validators.required),
  });
  breeders: User[] = [];
  advancedFilerQuery: string = '';
  selectedBreeder: string = '';
  timeOutInput!: any;

  constructor(
    private router: Router,
    private feedingDiaryService: FeedingDiaryService,
    private userService: UserService,
    public dialog: MatDialog,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.setParams(0, this.defaultPageSize, '', this.defaultSort, '', '');
    this.getBreeders();
    this.getFeedingDiaries();
  }

  showAdvancedFilter() {
    this.isShowAdvancedFilter = !this.isShowAdvancedFilter;
  }

  applyFilter() {
    const { from, to } = this.dateRange.value;
    console.log(from, to);
    let formQuery = !!from ? moment(from).format('YYYY-MM-DD') : '';
    let toQuery = !!to ? moment(to).format('YYYY-MM-DD') : '';
    if (!this.selectedBreeder) {
      this.selectedBreeder = '';
    }
    this.setParams(
      undefined,
      undefined,
      undefined,
      this.defaultSort,
      formQuery,
      toQuery,
      { idUser: this.selectedBreeder }
    );
    this.getFeedingDiaries();
  }

  resetFilter() {
    this.dateRange.reset();
    this.selectedBreeder = '';
  }

  setParams(
    skip?: number,
    limit?: number,
    search?: string,
    sort?: string,
    from?: string,
    to?: string,
    filter?: Object
  ) {
    this.params = {
      skip,
      limit,
      search,
      sort,
      from,
      to,
      filter,
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

  getBreeders() {
    this.loadingFilter = true;
    this.userService
      .getAllBreeders()
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

        this.breeders = data.items;
        this.loadingFilter = false;
      });
  }

  showDetail(feedingDiary: any) {
    const dialogRef = this.dialog.open(DetailComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '550px',
      minHeight: '200px',
      maxHeight: '100vh',
      disableClose: true,
      data: {
        feedingDiary,
      },
    });
  }

  onSearch(e: any) {
    clearTimeout(this.timeOutInput);
    const input = e.target.value;

    this.timeOutInput = setTimeout(() => {
      if (input === '' || input.length === 0) {
        this.setParams(
          undefined,
          this.defaultPageSize,
          undefined,
          this.defaultSort
        );
        this.getBreeders();
        return;
      }

      this.setParams(undefined, this.defaultPageSize, input, this.defaultSort);
      this.getFeedingDiaries();
    }, 500);
  }

  onSort(event: any) {
    const { active, direction } = event;
    console.log(this.sort);

    const limit = this.paginator.pageSize;
    const skip = limit * this.paginator.pageIndex;

    if (direction === '') {
      this.setParams(undefined, this.defaultPageSize, undefined, this.defaultSort);
    } else {
      const sortQuery = `${active} ${direction}`;
      this.setParams(skip, limit, undefined, sortQuery);
    }
    this.getFeedingDiaries();
  }

  onPagination(event: any) {
    const limit = event.pageSize;
    const skip = event.pageIndex * limit;
    const { active, direction } = this.sort;
    let sortQuery = active ? `${active} ${direction}` : this.defaultSort;
    this.setParams(skip, limit, undefined, sortQuery);
    this.getFeedingDiaries();
  }

  transformDate(date: number) {
    return moment(new Date(date)).locale('vi').format('L');
  }
}
