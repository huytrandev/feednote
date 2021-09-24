import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AreaService,
  FoodService,
  SnackbarService,
  Vietnamese,
} from 'src/app/core';
import { DialogComponent } from 'src/app/shared';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.scss'],
})
export class CreateUpdateComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  form!: FormGroup;
  isAddFood: boolean = false;
  submitted: boolean = false;
  food: any;
  loading: boolean = false;
  ingredientToRemove: any = [];
  isCreate: boolean = true;
  foodId!: string;
  areas: any = [];

  units: string[] = ['kg', 'lít'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private foodService: FoodService,
    private areaService: AreaService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog
  ) {
    this.foodId = this.route.snapshot.paramMap.get('id')!;
    this.isCreate = !this.foodId;
  }

  ngOnInit(): void {
    this.getAreas();
    this.buildForm();
    if (!this.isCreate) {
      this.getCowBreed();
    }
  }

  getAreas() {
    this.loading = true;
    this.areaService.getAll().subscribe((res) => {
      const { status } = res;
      if (!status) {
        return;
      }
      const { data } = res;
      this.areas = data.items;
      this.loading = false;
    });
  }

  getCowBreed(): void {
    this.loading = true;
    this.foodService.getById(this.foodId).subscribe((res) => {
      const { data, status } = res;
      if (!status) {
        this.loading = false;
        return;
      }
      this.food = data;
      this.setValueForForm(this.food);
      this.loading = false;
    });
  }

  get f() {
    return this.form.controls;
  }

  get ingredient(): FormArray {
    return this.form.get('ingredient') as FormArray;
  }

  buildForm(): void {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required]],
        unit: ['', [Validators.required]],
        idArea: ['', [Validators.required]],
        ingredient: this.fb.array([]),
      },
      {
        validator: Vietnamese('name'),
      }
    );
  }

  setValueForForm(food: any) {
    for (let propertyName in this.form.controls) {
      this.form.controls[propertyName].patchValue(food[propertyName]);
      if (propertyName === 'ingredient') {
        if (!!food[propertyName]) {
          this.setPeriodsForm(food[propertyName]);
        } else {
          this.ingredient.clear();
        }
      }
    }
  }

  setPeriodsForm(foodIngredient: any) {
    this.ingredient.clear();
    const ingredients = [...foodIngredient];
    ingredients.forEach((i) => {
      let ingredient: FormGroup = this.createIngredient();
      ingredient.patchValue(i);
      this.ingredient.push(ingredient);
    });
  }

  createIngredient() {
    return this.fb.group(
      {
        idIngredient: [''],
        name: ['', [Validators.required]],
        amount: ['', [Validators.required]],
      },
      {
        validator: Vietnamese('name'),
      }
    );
  }

  addIngredient(e: any) {
    e.preventDefault();
    this.ingredient.push(this.createIngredient());
  }

  removeIngredient(index: number, ingredient: any, e: any) {
    e.preventDefault();
    if (!!this.isCreate || !this.food['ingredient']) {
      this.ingredient.removeAt(index);
      return;
    }

    const { idIngredient } = ingredient;

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.foodService
          .deleteIngredient(this.foodId, idIngredient)
          .subscribe((res) => {
            const { status } = res;
            if (!!status) {
              this.snackbarService.openSnackBar(
                'Xoá thành phần dinh dưỡng thành công',
                'success',
                2000
              );
              this.ingredient.removeAt(index);
            } else {
              this.snackbarService.openSnackBar(
                'Xoá thành phần dinh dưỡng thất bại',
                'danger',
                2000
              );
            }
            this.reloadComponent();
          });
      }
    });
  }

  onReset() {
    if (!!this.isCreate) {
      this.buildForm();
    } else {
      this.setValueForForm(this.food);
    }
  }

  onSubmit() {
    if (!this.form.valid) return;

    const successNotification = !!this.isCreate
      ? 'Tạo mới thức ăn thành công'
      : 'Cập nhật thức ăn thành công';
    const failureNotification = !!this.isCreate
      ? 'Tạo mới thức ăn thất bại'
      : 'Cập nhật thức ăn thất bại';

    if (!!this.isCreate) {
      this.submitted = true;
      this.foodService.create(this.form.value).subscribe(
        (res: any) => {
          const { status } = res;
          if (!status) {
            this.submitted = false;
            this.form.reset();
            this.formGroupDirective.resetForm();
            this.snackbarService.openSnackBar(
              failureNotification,
              'danger',
              2000
            );
            return;
          }
          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.snackbarService.openSnackBar(
            successNotification,
            'success',
            2000
          );
        },
        (error: any) => {
          this.submitted = false;
          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.snackbarService.openSnackBar(
            failureNotification,
            'danger',
            2000
          );
        }
      );
    } else {
      this.submitted = true;
      this.foodService.update(this.foodId, this.form.value).subscribe(
        (res) => {
          const { status } = res;
          if (!status) {
            this.submitted = false;
            this.setValueForForm(this.food);
            this.snackbarService.openSnackBar(
              failureNotification,
              'danger',
              2000
            );
            return;
          }

          this.submitted = false;
          this.reloadComponent();
          this.snackbarService.openSnackBar(
            successNotification,
            'success',
            2000
          );
        },
        (error) => {
          this.submitted = false;
          this.submitted = false;
          this.setValueForForm(this.food);
          this.snackbarService.openSnackBar(
            failureNotification,
            'danger',
            2000
          );
        }
      );
    }
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  canSubmit(): boolean {
    if (!this.form.valid) {
      return false;
    }
    if (!this.form.dirty) {
      return false;
    }
    return true;
  }
}
