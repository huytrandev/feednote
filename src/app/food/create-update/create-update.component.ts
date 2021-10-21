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
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { AreaService, CommonService, FoodService } from 'src/app/core/services';
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
  food!: any;
  loading: boolean = false;
  ingredientToRemove: any = [];
  areas: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private foodService: FoodService,
    private areaService: AreaService,
    private commonService: CommonService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateUpdateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.food = data.food;
  }

  ngOnInit(): void {
    this.getAreas();
    this.buildForm();
    if (!!this.food) {
      this.setValueForForm(this.food);
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
    if (
      !this.food ||
      !this.food['ingredient'] ||
      index > this.food['ingredient'].length - 1
    ) {
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
          .deleteIngredientOfFood(this.food._id, idIngredient)
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
    if (!!this.food) {
      this.buildForm();
    } else {
      this.setValueForForm(this.food);
    }
  }

  onSubmit() {
    if (!this.form.valid) return;

    if (!this.food) {
      this.submitted = true;
      this.foodService.createFood(this.form.value).subscribe(
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
      this.submitted = true;
      this.foodService.updateFood(this.food._id, this.form.value).subscribe(
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
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.dialogRef.close({ type: 'close', status: null });
  }
}
