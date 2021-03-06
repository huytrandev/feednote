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
  fetchingStatistic: boolean = false;
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
  statisticDataByPeriod!: any;
  statisticDataByFood!: any;
  statisticDataByPeriodColumns: string[] = [
    'id',
    'periodName',
    'cowSerial',
    'weightDiary',
  ];
  userTypes: UserTypes = {
    totalUser: 0,
    totalAdmin: 0,
    totalBreeder: 0,
    totalManager: 0,
  };
  groupBy: string = 'food';

  constructor(
    private router: Router,
    private authService: AuthService,
    private statisticService: StatisticService,
    private userService: UserService,
    private cowBreedService: CowBreedService,
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
    this.breeders = {
      items: []
    }
    this.cowBreeds = {
      items: []
    }
    if (this.currentUser.role === 'admin') {
      this.fetchUsers();
    } else {
      this.fetchBreeders();
    }
    this.fetchCowBreeds();
    this.fetchFoods();
  }

  ngAfterViewInit() {
    this.generateCowBreedChart();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
      toQuery,
      this.groupBy
    );
    this.fetchCowIndicatorsStatistic();
  }

  buildQueryForCowIndicatorsStatistic(
    idUser: string,
    idCowBreed: string,
    from?: string,
    to?: string,
    groupBy?: string
  ) {
    this.queryForCowIndicatorsStatistic = {
      filter: {
        idUser,
        idCowBreed,
      },
      from,
      to,
      groupBy,
    };
  }

  fetchUsers() {
    this.loading = true;
    this.userService
      .fetchUsers({ limit: 100 })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { data, status } = res;

        if (!status) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.users = data;
        this.breeders = {
          items: []
        };
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
              this.breeders.items.push(user);
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
          this.router.navigate(['/not-found']);
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
          this.router.navigate(['/not-found']);
          return;
        }

        this.cowBreeds = data;
        this.loading = false;
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
          this.router.navigate(['/not-found']);
          return;
        }

        this.foods = data;
        this.loading = false;
      });
  }

  fetchCowIndicatorsStatistic() {
    this.fetchingStatistic = true;
    this.statisticService
      .fetchCowStatistic(this.queryForCowIndicatorsStatistic)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { data, status } = res;

        if (!status) {
          this.router.navigate(['/not-found']);
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
        if (this.groupBy === 'food') {
          this.statisticDataByPeriod = null;
          this.statisticDataByFood = data;
        } else {
          this.statisticDataByFood = null;
          this.statisticDataByPeriod = data;
        }
        this.fetchingStatistic = false;
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
          label: 'S??? con b??',
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
            text: 'Bi???u ????? th??ng tin v??? ????n b?? c???a h??? ch??n nu??i',
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
