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
import { AdvancedFilter } from 'src/app/core/models';
import { CommonService, FeedingDiaryService } from 'src/app/core/services';

import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  loading: boolean = true;
  isLoadMore: boolean = false;
  defaultSort: string = 'createdAt desc';
  defaultLimit: number = 5;
  totalCount: number = 0;
  fromParams = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    .toISOString()
    .substring(0, 10);
  toParams = new Date(Date.now()).toISOString().substring(0, 10);
  params: AdvancedFilter;
  // displayedColumns = ['id', 'createdDate', 'actions'];
  timeNow = moment(1632846192690).locale('vi').fromNow();

  diaries: any;
  foods = [
    {
      idFood: '61210c3ebf9a4cf4b571d0d1',
      amount: 20,
      name: 'Đậu phộng',
      unit: 'g',
    },
    {
      idFood: '612267b8596319f4761a2bca',
      amount: 25,
      name: 'Đậu Xanh',
      unit: 'g',
    },
    {
      idFood: '612267c5596319f4761a2bcb',
      amount: 49,
      name: 'Cỏ mỹ',
      unit: 'g',
    },
  ];

  now = moment('Tue Oct 05 2021 20:00:17').fromNow();

  displayedColumns = ['id', 'name', 'amount', 'unit'];

  constructor(
    private router: Router,
    private feedingDiaryService: FeedingDiaryService,
    public dialog: MatDialog,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.setParams(0, this.defaultLimit, '', this.defaultSort, '', '');
    this.getFeedingDiaries();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadMore() {
    this.isLoadMore = true;
    this.setParams(
      this.diaries.length,
      this.defaultLimit,
      '',
      this.defaultSort
    );
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
        this.diaries = this.diaries.concat(data.items);
        this.isLoadMore = false;
      });
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
        this.diaries = data.items;
        this.loading = false;
      });
  }

  onSearch(e: any) {}

  transformDate(date: number) {
    return moment(date).locale('vi').fromNow();
  }
}
