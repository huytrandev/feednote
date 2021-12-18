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
import { catchError, delay, takeUntil } from 'rxjs/operators';
import { AdvancedFilter, User } from 'src/app/core/models';
import {
  AuthService,
  FeedingDiaryService,
  UserService,
} from 'src/app/core/services';

import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from 'src/app/core/helpers/functions';

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
  displayedColumns: string[] = ['id', 'breederName', 'createdAt', 'incorrect'];
  detailFoodDiaryColumns: string[] = ['id', 'foodName', 'foodAmount'];
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
    from: new FormControl({ value: '', disabled: false }),
    to: new FormControl({ value: '', disabled: false }),
  });
  breeders: User[] = [];
  advancedFilerQuery: string = '';
  selectedBreeder: string = '';
  timeOutInput!: any;
  search: string = '';
  isInCorrect: boolean = false;

  selectedDiary!: any;
  currentUser!: any;

  constructor(
    private router: Router,
    private feedingDiaryService: FeedingDiaryService,
    private userService: UserService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.currentUser = this.authService.getUserInfo();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit(): void {
    if (this.currentUser.role === 'manager') {
      this.setParams(0, this.defaultPageSize, '', this.defaultSort, '', '', {
        idManager: this.currentUser._id,
      });
    } else if (this.currentUser.role === 'admin') {
      this.setParams(0, this.defaultPageSize, '', this.defaultSort, '', '');
    }

    this.getBreeders();
    this.getFeedingDiaries();

    this.dateRange.valueChanges.subscribe((value) => {
      this.applyFilter();
    });
  }

  applyFilter() {
    const { from, to } = this.dateRange.value;
    let filterQuery: { [k: string]: any } = {};
    if (this.currentUser.role === 'admin') {
      filterQuery = {};
    } else {
      filterQuery = {
        idManager: this.currentUser._id,
      };
    }
    let formQuery = !!from ? moment(from).format('YYYY-MM-DD') : '';
    let toQuery = !!to ? moment(to).format('YYYY-MM-DD') : '';
    if (this.selectedBreeder) {
      filterQuery['idUser'] = this.selectedBreeder;
    }

    if (this.isInCorrect) {
      filterQuery['isCorrect'] = !this.isInCorrect;
    } else {
      if ('isCorrect' in filterQuery) {
        delete filterQuery.isCorrect;
      }
    }

    if ('idUser' in filterQuery) {
      delete filterQuery.idManager;
    }

    this.setParams(
      undefined,
      undefined,
      undefined,
      this.defaultSort,
      formQuery,
      toQuery,
      filterQuery
    );
  }

  showFilter(event: any) {
    event.stopPropagation();
    this.isShowAdvancedFilter = !this.isShowAdvancedFilter;
  }

  onResetFilter() {
    this.search = '';
    this.selectedBreeder = '';
    this.dateRange.reset();
    this.isInCorrect = false;

    this.applyFilter();
    this.getFeedingDiaries();
  }

  onFilter() {
    if (!this.dateRange.valid) return;
    this.applyFilter();
    this.getFeedingDiaries();
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
    this.diaries = []
    this.feedingDiaryService
      .fetchFeedingDiaries(this.params)
      .pipe(takeUntil(this.ngUnsubscribe), delay(500))
      .subscribe((res) => {
        const { status, data } = res;
        if (!status) {
          this.loading = false;
          return;
        }

        this.totalCount = data.totalCount;
        let diaries: any[] = []
        if (data && data.items) {
          diaries = data.items.map((item: any) => {
            return {
              ...item,
              createdAt: formatDate(item.createdAt)
            }
          })
        }
        
        this.dataTableSource = new MatTableDataSource(diaries);
        this.loading = false;
      });
  }

  getBreeders() {
    this.loadingFilter = true;
    if (this.currentUser.role === 'admin') {
      const filter = {
        role: 'breeder',
      };

      this.userService
        .fetchUsers({ filter })
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
    } else if (this.currentUser.role === 'manager') {
      this.userService
        .fetchBreeders()
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
  }

  showDetail(feedingDiary: any) {
    this.selectedDiary = feedingDiary;
  }

  onClearDiary() {
    this.selectedDiary = null;
  }
  
  onSearch(e: any) {
    clearTimeout(this.timeOutInput);
    const { from, to } = this.dateRange.value;
    const input = e.target.value;
    let fromQuery: string = ''
    let toQuery: string = ''

    if (from || to) {
      fromQuery = !!from ? moment(from).format('YYYY-MM-DD') : '';
      toQuery = !!to ? moment(to).format('YYYY-MM-DD') : '';
    }

    this.timeOutInput = setTimeout(() => {
      if (!input) {
        if (this.isInCorrect) {
          this.setParams(
            undefined,
            this.defaultPageSize,
            undefined,
            this.defaultSort,
            fromQuery,
            toQuery,
            {
              idManager: this.currentUser._id,
              isCorrect: false
            }
          );
        } else {
          this.setParams(
            undefined,
            this.defaultPageSize,
            undefined,
            this.defaultSort,
            fromQuery,
            toQuery,
            {
              idManager: this.currentUser._id,
            }
          );
        }
        
        this.getFeedingDiaries();
        return;
      }

      if (this.isInCorrect) {
        this.setParams(
          undefined,
          this.defaultPageSize,
          input,
          this.defaultSort,
          fromQuery,
          toQuery,
          {
            idManager: this.currentUser._id,
            isCorrect: false
          }
        );
      } else {
        this.setParams(
          undefined,
          this.defaultPageSize,
          input,
          this.defaultSort,
          fromQuery,
          toQuery,
          {
            idManager: this.currentUser._id,
          }
        );
      }
      
      this.getFeedingDiaries();
    }, 500);
  }

  onSort(event: any) {
    const { active, direction } = event;

    const limit = this.paginator.pageSize;
    const skip = limit * this.paginator.pageIndex;

    if (direction === '') {
      this.setParams(
        undefined,
        this.defaultPageSize,
        undefined,
        this.defaultSort,
        undefined,
        undefined,
        {
          idManager: this.currentUser._id,
        }
      );
    } else {
      const sortQuery = `${active} ${direction}`;
      this.setParams(skip, limit, undefined, sortQuery, undefined, undefined, {
        idManager: this.currentUser._id,
      });
    }
    this.getFeedingDiaries();
  }

  onPagination(event: any) {
    const limit = event.pageSize;
    const skip = event.pageIndex * limit;
    const { from, to } = this.dateRange.value;
    const { active, direction } = this.sort;
    let sortQuery = active ? `${active} ${direction}` : this.defaultSort;
    let params: AdvancedFilter = {
      skip,
      limit,
      search: '',
      sort: sortQuery
    }
    if (!this.selectedBreeder) {
      params.filter = {
        idManager: this.currentUser._id
      }
    } else {
      params.filter = {
        idUser: this.selectedBreeder
      }
    }
    if (from || to) {
      let fromQuery = !!from ? moment(from).format('YYYY-MM-DD') : '';
      let toQuery = !!to ? moment(to).format('YYYY-MM-DD') : '';
      params.from = fromQuery
      params.to = toQuery
    }
    
    if (this.isInCorrect) {
      let filter = {
        ...params.filter,
        isCorrect: false
      }

      params.filter = filter
    }
    this.params = params
    this.getFeedingDiaries();
  }
}
