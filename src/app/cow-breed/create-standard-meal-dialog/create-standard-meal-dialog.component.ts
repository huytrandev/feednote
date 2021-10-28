import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AreaService, FoodService, MealService } from 'src/app/core/services';

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
  foods: any[] = [];
  submitted: boolean = false;
  fetching: boolean = false;

  constructor(
    private fb: FormBuilder,
    private mealService: MealService,
    private foodService: FoodService,
    private areaService: AreaService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateStandardMealDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.period = data.period;
  }

  ngOnInit(): void {
    this.fetchAreas();
  }

  fetchAreas() {
    this.loading = true;
    this.areaService.fetchAreas().subscribe((res) => {
      this.areas = res.data.items;
      this.loading = false;
    });
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
      this.foods = res.data.items;
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
        idFood: item,
      };
    });
    const meal = {
      idArea: this.form.get('idArea')?.value,
      idPeriod: this.period._id,
      foods,
    };

    this.submitted = true;
    this.mealService.createMeal(meal).subscribe((res) => {
      const { status } = res;
      if (!status) {
        this.dialogRef.close({
          status: 'fail',
        });
        this.submitted = false;
        return;
      }

      this.dialogRef.close({
        status: 'success',
      });
      this.submitted = false;
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
