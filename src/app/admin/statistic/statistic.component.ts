import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdvancedFilter, CowBreed, Food, User } from 'src/app/core/models';
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

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent implements OnInit, OnDestroy, AfterViewInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild('mychart') myChart: any;
  canvas: any;
  ctx: any;
  loading: boolean = true;
  dateRange = new FormGroup({
    from: new FormControl({ value: '', disabled: true }, Validators.required),
    to: new FormControl({ value: '', disabled: true }, Validators.required),
  });

  selectedBreeder: string = '';
  selectedCowBreed: string = '';
  percentageOfBreederCompletedFeedingDiary: number = 85;

  queryForCowIndicatorsStatistic: AdvancedFilter;
  cowIndicatorsStatistic: any;

  users: any;
  breeders: any;
  cowBreeds: any;
  foods: any;
  currentUser: any;

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
    private foodService: FoodService
  ) {
    this.currentUser = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    if (this.currentUser.role === 'admin') {
      this.fetchUsers();
    } else {
      this.fetchBreeders();
    }
    this.fetchCowBreeds();
    this.fetchFoods();
  }

  ngAfterViewInit() {
    this.buildQueryForCowIndicatorsStatistic(
      '61224990e669faeab9e2fe26',
      '611fdf8f4d26dbd6b610406b',
      '2021-08-19'
    );
    this.fetchCowIndicatorsStatistic();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

  fetchUsers() {
    this.loading = true;
    this.userService
      .fetchUsers({limit: 100})
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
          switch(user.role) {
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

        this.cowIndicatorsStatistic = data;
        let labels: any[] = [];
        let dataChart: any[] = [];
        [...this.cowIndicatorsStatistic].forEach((item) => {
          labels.push(item.name);
          dataChart.push(item.cows.length);
        });
        this.generateCowBreedChart(labels, dataChart);
        this.loading = false;
      });
  }

  generateCowBreedChart(labels: Array<any>, dataChart: Array<any>) {
    this.canvas = this.myChart.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    const data = {
      labels,
      datasets: [
        {
          label: 'Tổng số bò',
          data: dataChart,
          backgroundColor: [
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
          ],
        },
      ],
    };

    new Chart(this.ctx, {
      type: 'bar',
      data,
      options: {
        responsive: true,
      },
    });
  }
}
