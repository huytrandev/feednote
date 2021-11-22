import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  AreaService,
  AuthService,
  CommonService,
  FoodService,
  MealService,
} from 'src/app/core/services';

@Component({
  selector: 'app-create-standard-meal-dialog',
  templateUrl: './create-standard-meal-dialog.component.html',
  styleUrls: ['./create-standard-meal-dialog.component.scss'],
})
export class CreateStandardMealDialogComponent implements OnInit {
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

  constructor(
    private mealService: MealService,
    private foodService: FoodService,
    private areaService: AreaService,
    private authService: AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateStandardMealDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.period = data.period;
    this.currentUser = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    if (this.currentUser.role === 'manager') {
      // this.fetchAreas();
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

  fetchAreas() {
    this.loading = true;
    this.areaService.fetchAreas().subscribe((res) => {
      this.areas = res.data.items;
      this.loading = false;
    });
  }

  onFoodChange(event: any) {
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

  onAreaChange(event: any) {
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

  onClose() {
    this.dialogRef.close({ type: 'close' });
  }

  onSubmit() {
    if (!this.form.valid) return;

    const foods = [...this.form.get('idsFood')?.value].map((item) => {
      return {
        idFood: item._id,
      };
    });

    let meal = {};

    if (this.currentUser.role === 'admin') {
      meal = {
        idArea: this.form.get('idArea')?.value,
        idPeriod: this.period._id,
        foods,
      };
    } else {
      meal = {
        idArea: this.currentUser.idArea,
        idPeriod: this.period._id,
        foods,
      };
    }

    this.submitted = true;
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
      });
    });
  }

  getTypeName(type: any): string {
    const localType = Number(type);
    switch (localType) {
      case 0:
        return 'Thức ăn thô';
      case 1:
        return 'Thức ăn tinh';
      default:
        return 'Không xác định';
    }
  }
}
