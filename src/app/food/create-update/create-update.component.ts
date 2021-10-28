import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { INITIAL_FOOD_INGREDIENT } from 'src/app/core/constant';
import { IS_DECIMAL } from 'src/app/core/helpers';
import { AreaService, AuthService, FoodService } from 'src/app/core/services';
import { Vietnamese } from 'src/app/core/validations';

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
  food!: any;
  loading: boolean = false;
  ingredientToRemove: any = [];
  areas: any = [];
  isModified: boolean = false;
  currentUser!: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private foodService: FoodService,
    private areaService: AreaService,
    private authService: AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateUpdateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.food = data.food;
    this.currentUser = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.getAreas();
    this.buildForm();
    if (!!this.food) {
      this.setValueForForm(this.food);
    } else {
      this.setPeriodsForm(INITIAL_FOOD_INGREDIENT);
    }

    if (this.currentUser.role !== 'admin') {
      this.form.removeControl('idArea');
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getAreas() {
    this.loading = true;
    this.areaService
      .fetchAreas()
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
        type: ['0', [Validators.required]],
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
      if (propertyName === 'type') {
        const type = String(food[propertyName]);
        this.form.controls[propertyName].patchValue(type);
      }
      
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
    return this.fb.group({
      idIngredient: [''],
      name: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(IS_DECIMAL)]],
    });
  }

  onReset() {
    if (!this.food) {
      this.buildForm();
      this.setPeriodsForm(INITIAL_FOOD_INGREDIENT);
    } else {
      this.setValueForForm(this.food);
    }
  }

  capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  onSubmit() {
    if (!this.form.valid) return;

    this.submitted = true;
    const food = {
      ...this.form.value,
      name: this.capitalizeFirstLetter(this.form.value.name.trim()),
      type: Number(this.form.value.type),
    };

    if (!this.food) {
      this.foodService.createFood(food).subscribe(
        (res: any) => {
          const { status } = res;
          if (!status) {
            this.submitted = false;
            this.form.reset();
            this.formGroupDirective.resetForm();
            this.dialogRef.close({
              type: 'create',
              status: 'fail',
            });
            return;
          }
          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.dialogRef.close({
            type: 'create',
            status: 'success',
          });
        },
        (error: any) => {
          this.submitted = false;
          this.submitted = false;
          this.formGroupDirective.resetForm();
          this.dialogRef.close({
            type: 'create',
            status: 'fail',
          });
        }
      );
    } else {
      this.foodService.updateFood(this.food._id, food).subscribe(
        (res) => {
          const { status } = res;
          if (!status) {
            this.submitted = false;
            this.dialogRef.close({
              type: 'update',
              status: 'fail',
            });
            return;
          }

          this.submitted = false;
          this.dialogRef.close({
            type: 'update',
            status: 'success',
          });
        },
        (error) => {
          this.submitted = false;
          this.submitted = false;
          this.setValueForForm(this.food);
          this.dialogRef.close({
            type: 'update',
            status: 'fail',
          });
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

  onClose() {
    this.dialogRef.close({ type: 'close', isModified: this.isModified });
  }
}
