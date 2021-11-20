import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { AdvancedFilter } from 'src/app/core/models';
import {
  AreaService,
  CommonService,
  CowBreedService,
  MealService,
} from 'src/app/core/services';
import { getTypeFoodName, formatDate } from 'src/app/core/helpers/functions'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  fetching: boolean = false;
  fetchingFilter: boolean = false;
  array: any[] = [
    {
      key: 1,
      value: 'item 1',
    },
    {
      key: 2,
      value: 'item 2',
    },
    {
      key: 3,
      value: 'item 3',
    },
  ];
  mealColumns: string[] = [
    'id',
    'foodName',
    'foodType',
    'foodRatio',
    'foodAmount',
  ];
  isShowFilter: boolean = true;
  mealList!: any;
  cowBreeds: any[] = [];
  periods: any[] = [];
  areas: any[] = [];

  selectedCowBreed!: string;
  selectedCowBreedPeriod!: string;
  selectedArea!: string;

  constructor(
    private mealService: MealService,
    private cowBreedService: CowBreedService,
    private areaService: AreaService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.getCowBreeds();
    this.getAreas();
    // this.getMeals();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getMeals(): void {
    this.fetching = true;

    this.mealList = null;
    let query: AdvancedFilter = {};
    if (this.selectedCowBreedPeriod) {
      query = {
        filter: { idPeriod: this.selectedCowBreedPeriod },
      };
    }

    if (Object.keys(query).length === 0 && this.selectedCowBreed) {
      query = {
        filter: { idCowBreed: this.selectedCowBreed },
      };
    }

    if (Object.keys(query).length === 0 && this.selectedArea) {
      query = {
        filter: { idArea: this.selectedArea },
      };
    }

    this.mealService
      .fetchMeals(query)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(err => {
          this.fetching = false;
          this.commonService.openAlert('Giống bò chưa có nhu cầu dinh dưỡng', 'danger');
          return err;
        })
      )
      .subscribe((res: any) => {
        const { status, data } = res;
        if (!status) {
          this.fetching = false;
          return;
        }

        let areaList: string[] = [];
        let idPeriodList: string[] = [];
        let groupByPeriod!: { idPeriod: string; meals: any[] }[];
        let mealListTemp: any[] = [];
        // [...data.items].forEach((item: any) => {
        //   if (!areaList.includes(item.idArea)) {
        //     areaList.push(item.idArea);
        //   }
        //   if (!idPeriodList.includes(item.idPeriod)) {
        //     idPeriodList.push(item.idPeriod);
        //   }
        //   if (idPeriodList.includes(item.idPeriod)) {

        //   }
        // });
        const meal = data.items.map((item: any) => {
          const foods = item.foods.map((food: any) => {
            return {
              ...food,
              type: getTypeFoodName(food.type)
            }
          })

          return {
            ...item,
            foods,
            createdAt: formatDate(item.createdAt)
          }
        })
        this.mealList = meal;
        this.fetching = false;
      });
  }

  getAreas(): void {
    this.fetchingFilter = true;
    this.areaService
      .fetchAreas()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: any) => {
        const { data } = res;
        this.areas = data.items;
        this.fetchingFilter = false;
      });
  }

  getCowBreeds(): void {
    this.fetchingFilter = true;
    this.cowBreedService
      .fetchCowBreeds()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: any) => {
        const { data } = res;
        this.cowBreeds = data.items;
        this.fetchingFilter = false;
      });
  }

  getPeriods(): void {
    this.cowBreedService
      .fetchCowBreed(this.selectedCowBreed)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: any) => {
        const { data } = res;
        this.periods = data.periods;
      });
  }

  onCowBreedChange(): void {
    if (!this.selectedCowBreed) {
      this.mealList = null;
      return;
    }
    this.getMeals();
    this.getPeriods();
  }

  onCowBreedPeriodChange(): void {
    // if (!this.selectedCowBreedPeriod) {
    //   this.mealList = null;
    //   this.getMeals();

    //   return;
    // }
    this.getMeals();
  }

  onAreaChange(): void {
    if (!this.selectedArea) {
      this.mealList = null;
      return;
    }
    this.getMeals();
  }

  onShowFilter(): void {
    this.isShowFilter = !this.isShowFilter;
  }
}
