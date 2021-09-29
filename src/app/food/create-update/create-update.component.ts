import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import {
  AreaService,
  CommonService,
  FoodService,
} from 'src/app/core/services';
import { Vietnamese } from 'src/app/core/validations';
import { DialogComponent } from 'src/app/shared';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.scss'],
})
export class CreateUpdateComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  form!: FormGroup;
  submitted: boolean = false;
  food: any;
  loading: boolean = false;
  ingredientToRemove: any = [];
  isCreate: boolean = true;
  foodId!: string;
  areas: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private foodService: FoodService,
    private areaService: AreaService,
    private commonService: CommonService,
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getAreas() {
    this.loading = true;
    this.areaService
      .getAll()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((_) => this.router.navigate(['not-found']))
      )
      .subscribe((res) => {
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
      width: '400px',
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.foodService
          .deleteIngredient(this.foodId, idIngredient)
          .subscribe((res) => {
            const { status } = res;
            if (!!status) {
              this.commonService.openAlert(
                'Xoá thành phần dinh dưỡng thành công',
                'success'
              );
              this.ingredient.removeAt(index);
            } else {
              this.commonService.openAlert(
                'Xoá thành phần dinh dưỡng thất bại',
                'danger'
              );
            }
            this.commonService.reloadComponent();
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
            this.commonService.openAlert(failureNotification, 'danger');
            return;
          }
          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.commonService.openAlert(successNotification, 'success');
        },
        (error: any) => {
          this.submitted = false;
          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.commonService.openAlert(failureNotification, 'danger');
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
            this.commonService.openAlert(failureNotification, 'danger');
            return;
          }

          this.submitted = false;
          this.commonService.reloadComponent();
          this.commonService.openAlert(successNotification, 'success');
        },
        (error) => {
          this.submitted = false;
          this.submitted = false;
          this.setValueForForm(this.food);
          this.commonService.openAlert(failureNotification, 'danger');
        }
      );
    }
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
