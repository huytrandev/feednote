import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { INITIAL_PERIOD_NUTRITION } from 'src/app/core/constant';
import { AreaService, AuthService, CowBreedService, FoodService, MealService } from 'src/app/core/services';

@Component({
  selector: 'app-create-meal',
  templateUrl: './create-meal.component.html',
  styleUrls: ['./create-meal.component.scss']
})
export class CreateMealComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup = new FormGroup({
    idArea: new FormControl('', [Validators.required]),
    idsFood: new FormControl({ value: [], disabled: true }, [
      Validators.required,
    ]),
  });
  period!: any;
  areas: any[] = [];
  foods: any[any] = [];
  submitted: boolean = false;
  fetching: boolean = false;
  currentUser!: any;
  isValidFood: boolean = false;
  selectedCowBreed!: string;
  selectedCowBreedPeriod!: string;
  cowBreeds: any[] = [];
  periods: any[] = [];
  allowCreateMeal: boolean = true

  constructor(
    private mealService: MealService,
    private cowBreedService: CowBreedService,
    private foodService: FoodService,
    private areaService: AreaService,
    private authService: AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateMealComponent>,
  ) {
    this.currentUser = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.getCowBreeds()
    if (this.currentUser.role === 'manager') {
      this.fetching = true;
      this.form.removeControl('idArea');
      this.form.controls['idsFood'].enable();

      const params = {
        idArea: this.currentUser.idArea,
      };

      this.foodService.fetchFoods({ filter: params }).subscribe((res) => {
        const data = res.data.items;
        const type0: any[] = [...data].filter(
          (item) => Number(item.type) === 0
        );
        const type1: any[] = [...data].filter(
          (item) => Number(item.type) === 1
        );
        this.foods = [
          {
            type: 'Thức ăn thô',
            items: type0,
          },
          {
            type: 'Thức ăn tinh',
            items: type1,
          },
        ];
        this.fetching = false;
      });
    } else {
      this.fetchAreas();
    }
  }

  getCowBreeds(): void {
    this.loading = true;
    this.cowBreedService
      .fetchCowBreeds()
      .subscribe((res: any) => {
        const { data } = res;
        this.cowBreeds = data.items;
        this.loading = false;
      });
  }

  getPeriods(): void {
    this.periods = []
    this.cowBreedService
      .fetchCowBreed(this.selectedCowBreed)
      .subscribe((res: any) => {
        const { data } = res;
        this.periods = data.periods;
      });
  }

  fetchAreas() {
    this.loading = true;
    this.areaService.fetchAreas().subscribe((res) => {
      this.areas = res.data.items;
      this.loading = false;
    });
  }

  onSubmit () {
    if (!this.form.valid) return;
    this.submitted = true;
    const foods = [...this.form.get('idsFood')?.value].map((item) => {
      return {
        idFood: item._id,
      };
    });

    let meal = {}

    if (this.currentUser.role === 'admin') {
      meal = {
        idArea: this.form.get('idArea')?.value,
        idPeriod: this.selectedCowBreedPeriod,
        foods,
      };
    } else {
      meal = {
        idArea: this.currentUser.idArea,
        idPeriod: this.selectedCowBreedPeriod,
        foods,
      };
    }

    this.mealService.createMeal(meal).subscribe((res) => {
      const { status, data } = res;
      if (!status) {
        this.dialogRef.close({
          status: 'fail',
        });
        this.submitted = false;
        return;
      }
      this.submitted = false;
      this.dialogRef.close({
        status: 'success',
        data,
        periodId: this.selectedCowBreedPeriod
      });
    });
  }

  onClose () {
    this.dialogRef.close({ type: 'close' });
  }

  onCowBreedChange () {
    if (!this.selectedCowBreed) {
      return
    }
    this.getPeriods();
  }

  onCowBreedPeriodChange () {
    if (!this.selectedCowBreedPeriod) {
      return
    }
    this.getPeriod()
  }
  

  onFoodChange (event: any) {
    const foods = event.value;
    let type0 = 0,
      type1 = 0;
    [...foods].forEach((element) => {
      if (Number(element.type) === 0) {
        type0 += 1;
      } else if (Number(element.type) === 1) {
        type1 += 1;
      }
    });

    this.isValidFood = type0 === 2 && type1 === 1;
  }

  onAreaChange (event: any) {
    const idArea = event.value;
    if (!idArea) {
      this.foods = [];
      this.form.controls['idsFood'].disable();
      return;
    }

    this.form.controls['idsFood'].enable();
    const params = {
      idArea,
    };

    this.fetching = true;
    this.foodService.fetchFoods({ filter: params }).subscribe((res) => {
      const data = res.data.items;
      const type0: any[] = [...data].filter((item) => Number(item.type) === 0);
      const type1: any[] = [...data].filter((item) => Number(item.type) === 1);
      this.foods = [
        {
          type: 'Thức ăn thô',
          items: type0,
        },
        {
          type: 'Thức ăn tinh',
          items: type1,
        },
      ];
      this.fetching = false;
    });
  }

  getPeriod(): void {
    this.cowBreedService
      .fetchPeriod(this.selectedCowBreedPeriod)
      .subscribe((res: any) => {
        const { status, data } = res;
        if (!status) {
          return;
        }

        const nutrition = data.nutrition.map((n: any) => {
          const description = INITIAL_PERIOD_NUTRITION.find(
            (field: any) => field.name === n.name
          )?.description;
          return {
            ...n,
            description,
          };
        });

        const period = {
          ...data,
          nutrition
        }
        this.period = period;
        const nutritionValueZero = period.nutrition.find(
          (item: any) => item.amount === 0
        );
        this.allowCreateMeal = nutritionValueZero ? false : true
      });
  }
}
