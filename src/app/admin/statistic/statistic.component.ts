import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { AdvancedFilter } from 'src/app/core/models';
import {
  AuthService,
  CowBreedService,
  FeedingDiaryService,
  FoodService,
  StatisticService,
  UserService,
} from 'src/app/core/services';

Chart.register(...registerables);

export interface UserTypes {
  totalUser: number;
  totalAdmin: number;
  totalManager: number;
  totalBreeder: number;
}

const colorScheme = [
  '#C68B59',
  '#9E7777',
  '#BD4B4B',
  '#FDE49C',
  '#DAD5AB',
  '#5C527F',
  '#F6A9A9',
  '#368B85',
  '#6B7AA1',
  '#93B5C6',
  '#D5EEBB',
  '#DF711B',
];

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent implements OnInit, OnDestroy, AfterViewInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild('mychart') myChart: any;
  chart!: any;
  canvas: any;
  ctx: any;
  loading: boolean = true;
  dateRange = new FormGroup({
    from: new FormControl({ value: '', disabled: false }),
    to: new FormControl({ value: '', disabled: false }),
  });

  selectedBreeder: string = '';
  selectedCowBreed: string = '';
  percentageOfBreederCompletedFeedingDiary: number = 85;

  queryForCowIndicatorsStatistic: AdvancedFilter;
  cowIndicatorsStatistic = {
    totalCow: 0,
  };

  users!: any;
  breeders!: any;
  cowBreeds!: any;
  foods!: any;
  diaries!: any;
  currentUser: any;
  todayDiaries: number = 0;

  userTypes: UserTypes = {
    totalUser: 0,
    totalAdmin: 0,
    totalBreeder: 0,
    totalManager: 0,
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private statisticService: StatisticService,
    private userService: UserService,
    private cowBreedService: CowBreedService,
    private feedingDiaryService: FeedingDiaryService,
    private foodService: FoodService
  ) {
    this.currentUser = this.authService.getUserInfo();
  }

  get canViewChart() {
    return (
      !!this.selectedBreeder && !!this.selectedCowBreed && this.dateRange.valid
    );
  }

  ngOnInit(): void {
    if (this.currentUser.role === 'admin') {
      this.fetchUsers();
    } else {
      this.fetchBreeders();
    }
    this.fetchCowBreeds();
    this.fetchFoods();
    // this.fetchFeedingDiaries();
  }

  ngAfterViewInit() {
    this.generateCowBreedChart();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  countTodayDiaries(diaries: Array<any>) {
    let count = 0;
    let breederCompletedDiary: any[] = [];
    diaries.forEach((d) => {
      let createdAtDate = moment(d.createdAt);
      let isSameDay = createdAtDate.isSame(moment(1634665228659), 'day');
      if (isSameDay) {
        count += 1;
        let isAlreadyInArray = breederCompletedDiary.find(
          (item) => item === d.idBreeder
        );
        if (!isAlreadyInArray) {
          breederCompletedDiary.push(d.idBreeder);
        }
      }
    });

    console.log(Math.round(breederCompletedDiary.length / 7 * 100));
    return {
      numOfDiariesToday: count,
      numOfBreederCompletedDiaries: breederCompletedDiary.length,
    };
  }

  applyFilter() {
    const { from, to } = this.dateRange.value;
    let fromQuery = !!from ? moment(from).format('YYYY-MM-DD') : '';
    let toQuery = !!to ? moment(to).format('YYYY-MM-DD') : '';
    let idUserQuery = !this.selectedBreeder ? '' : this.selectedBreeder;
    let idCowBreedQuery = !this.selectedCowBreed ? '' : this.selectedCowBreed;
    this.buildQueryForCowIndicatorsStatistic(
      idUserQuery,
      idCowBreedQuery,
      fromQuery,
      toQuery
    );
    this.fetchCowIndicatorsStatistic();
  }

  buildQueryForCowIndicatorsStatistic(
    idUser: string,
    idCowBreed: string,
    from?: string,
    to?: string
  ) {
    this.queryForCowIndicatorsStatistic = {
      filter: {
        idUser,
        idCowBreed,
      },
      from,
      to,
    };
  }

  fetchFeedingDiaries() {
    this.loading = true;
    this.feedingDiaryService
      .fetchFeedingDiaries()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { status, data } = res;
        if (!status) {
          this.loading = false;
          return;
        }

        this.diaries = data;

        this.todayDiaries = this.countTodayDiaries(
          data.items
        ).numOfDiariesToday;
        this.loading = false;
      });
  }

  fetchUsers() {
    this.loading = true;
    this.userService
      .fetchUsers({ limit: 100 })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { data, status } = res;

        if (!status) {
          this.router.navigate(['/404']);
          return;
        }

        this.users = data;
        this.userTypes.totalUser = data.totalCount;
        [...data.items].forEach((user) => {
          switch (user.role) {
            case 'admin':
              this.userTypes.totalAdmin += 1;
              break;
            case 'manager':
              this.userTypes.totalManager += 1;
              break;
            case 'breeder':
              this.userTypes.totalBreeder += 1;
              break;
          }
        });
        this.loading = false;
      });
  }

  fetchBreeders() {
    this.loading = true;
    this.userService
      .fetchBreeders()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { data, status } = res;

        if (!status) {
          this.router.navigate(['/404']);
          return;
        }

        this.breeders = data;
      });
  }

  fetchCowBreeds() {
    this.loading = true;
    this.cowBreedService
      .fetchCowBreeds()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { data, status } = res;

        if (!status) {
          this.router.navigate(['/404']);
          return;
        }

        this.cowBreeds = data;
      });
  }

  fetchFoods() {
    this.loading = true;
    this.foodService
      .fetchFoods()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { data, status } = res;

        if (!status) {
          this.router.navigate(['/404']);
          return;
        }

        this.foods = data;
      });
  }

  fetchCowIndicatorsStatistic() {
    this.loading = true;
    this.statisticService
      .fetchCowIndicatorsStatistic(this.queryForCowIndicatorsStatistic)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { data, status } = res;

        if (!status) {
          this.router.navigate(['/404']);
          return;
        }

        let labels: any[] = [];
        let dataChart: any[] = [];
        [...data].forEach((item) => {
          this.cowIndicatorsStatistic.totalCow += item.cows.length;
          labels.push(item.name);
          dataChart.push(item.cows.length);
        });
        this.generateCowBreedChart(labels, dataChart);
        this.loading = false;
      });
  }

  generateCowBreedChart(labels?: Array<any>, dataChart?: Array<any>) {
    if (!!this.chart) {
      this.chart.destroy();
    }

    this.canvas = this.myChart.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    const data = {
      labels: labels ? labels : [],
      datasets: [
        {
          label: 'Số con bò',
          data: dataChart ? dataChart : [],
          backgroundColor: colorScheme,
        },
      ],
    };

    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Biểu đồ thông tin về đàn bò của hộ chăn nuôi',
          },
        },
        scales: {
          yAxes: {
            ticks: {
              callback: function (value) {
                if (Number.isInteger(value)) {
                  return value;
                }
                return;
              },
              stepSize: 1,
            },
          },
        },
      },
    });
  }
}
