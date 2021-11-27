import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { IS_DECIMAL } from 'src/app/core/helpers';
import { MealService } from 'src/app/core/services';

@Component({
  selector: 'app-preview-standard-meal-dialog',
  templateUrl: './preview-standard-meal-dialog.component.html',
  styleUrls: ['./preview-standard-meal-dialog.component.scss'],
})
export class PreviewStandardMealDialogComponent implements OnInit {
  loading: boolean = false;
  form!: FormGroup;
  mealColumns: string[] = [
    'id',
    'foodName',
    'foodType',
    'foodRatio',
    'foodAmount',
  ];
  mealData!: any;
  submitting: boolean = false;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private mealService: MealService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PreviewStandardMealDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mealData = data;
    this.isEdit = data.isEdit;
  }

  get f() {
    return this.form.controls;
  }

  get foodsField() {
    return this.form.get('foods') as FormArray;
  }

  ngOnInit(): void {
    this.buildForm();
    if (!this.isEdit) {
      const meal = this.mealData.items[0].foods.map((item: any) => {
        return {
          ...item,
          ratio: Number(item.ratio) * 100
        }
      })
      this.setFoodForm(meal);
    } else {
      const meal = this.mealData.foods.map((item: any) => {
        return {
          ...item,
          ratio: Number(item.ratio) * 100
        }
      })
      this.setFoodForm(meal);
    }
  }

  onClose(): void {
    this.dialogRef.close({ type: 'close' });
  }

  getRatioValidity(i: any) {
    return (<FormArray>this.form.get('foods')).controls[i].get('ratio')
      ?.invalid;
  }

  getAmountValidity(i: any) {
    return (<FormArray>this.form.get('foods')).controls[i].get('amount')
      ?.invalid;
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    this.submitting = true;
    const foods = [...this.form.value.foods].map((item) => {
      return {
        ...item,
        idFood: item._id,
        ratio: Number(item.ratio) / 100,
        amount: Number(item.amount),
      };
    });
    const meal = {
      idArea: this.mealData.items[0].idArea,
      idPeriod: this.mealData.items[0].idPeriod,
      foods,
    };

    this.mealService.saveMeal(meal).subscribe((res) => {
      const { status } = res;
      if (!status) {
        this.dialogRef.close({
          status: 'fail',
        });
        this.submitting = false;
        return;
      }

      this.dialogRef.close({
        status: 'success',
      });
      this.submitting = false;
    });
  }

  onReset(): void {
    this.setFoodForm(this.mealData);
  }

  buildForm(): void {
    this.form = this.fb.group({
      foods: this.fb.array([]),
    });
  }

  buildFormArray() {
    return this.fb.group({
      _id: [''],
      name: [''],
      type: [''],
      unit: [''],
      ratio: [
        '',
        [
          Validators.required,
          Validators.pattern(IS_DECIMAL),
          Validators.min(0),
        ],
      ],
      amount: [
        '',
        [
          Validators.required,
          Validators.pattern(IS_DECIMAL),
          Validators.min(0),
        ],
      ],
    });
  }

  setFoodForm(meal: any) {
    const foodCrl = this.form.get('foods') as FormArray;
    foodCrl.clear();
    const foods = [...meal];
    foods.forEach((f) => {
      let food: FormGroup = this.buildFormArray();
      food.patchValue(f);
      foodCrl.push(food);
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

  printMealData() {
    const foods = [...this.form.value.foods].map((item) => {
      return {
        ...item,
        idFood: item._id,
        ratio: Number(item.ratio),
        amount: Number(item.amount),
      };
    });

    const items = [...this.mealData.items].map((item) => {
      return {
        ...item,
        foods,
      };
    });

    const meal = {
      ...this.mealData,
      items,
    };

    this.mealService.generateMealDataFile(meal).subscribe((res) => {
      const blob = new Blob([res], { type: 'application/pdf' });
      var downloadURL = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'khau-phan-an-chuan.pdf';
      link.click();
    });
  }
}
