import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs/operators';
import {
  Area,
  AreaService,
  SnackbarService,
  User,
  UserService,
  Vietnamese,
} from 'src/app/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  form!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  user!: User;
  areas: Area[] = [];
  users: User[] = [];
  managers: User[]= []
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private areaService: AreaService
  ) {}

  ngOnInit(): void {
    this.getAreas();
    // this.getManagers();
    this.getUsers();
    this.buildForm();
  }

  get f() {
    return this.form.controls;
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

  getUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe((res) => {
      const { status } = res;
      if (!status) {
        return;
      }
      const { data } = res;
      this.users = data.items;
      this.loading = false;
    });
  }

  getManagers() {
    this.loading = true;
    this.userService.getAllManager().subscribe(res => {
      const { status } = res;
      if (!status) {
        return;
      }
      const { data } = res;
      this.managers = data.items;
      this.loading = false;
    })
  }

  validateUsernameExist(control: AbstractControl) {
    return this.userService.getAllUsers().pipe(
      map((res) => {
        const users = res.data.items;
        if (users.some((b: any) => b.username === control.value)) {
          return { usernameExisted: true };
        } else {
          return null;
        }
      })
    );
  }

  buildForm(): void {
    this.form = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(/^[\w\s]+$/),
          ],
          this.validateUsernameExist.bind(this),
        ],
        password: ['', [Validators.required, Validators.minLength(5)]],
        isManager: [false],
        name: ['', [Validators.required, Validators.minLength(5)]],
        phone: ['', [Validators.pattern('[- +()0-9]{10}')]],
        email: ['', [Validators.email]],
        idArea: ['', [Validators.required]],
      },
      {
        validator: [Vietnamese('name')],
      }
    );
  }

  onSubmit() {
    if (!this.form.valid) return;

    const { isManager } = this.form.value;
    const role = isManager ? 'manager' : 'breeder';
    console.log({ ...this.form.value, role });
    return;

    const successNotification = 'Tạo mới người dùng thành công';
    const failureNotification = 'Tạo mới người dùng thất bại';
    this.submitted = true;
    this.userService.createUser(this.form.value).subscribe((res) => {
      const { status } = res;
      if (!status) {
        this.snackbarService.openSnackBar(failureNotification, 'danger', 2000);
        this.submitted = false;
        return;
      }

      this.submitted = false;
      this.formGroupDirective.resetForm();
      this.snackbarService.openSnackBar(successNotification, 'success', 2000);
    });
  }

  onReset() {
    this.buildForm();
  }

  generatePassword() {
    let generatedPassword = '';
    const passwordLength = 10;

    const numberChars = '0123456789';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    let allChars = numberChars + upperChars + lowerChars;
    let randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray = randPasswordArray.fill(allChars, 3);
    generatedPassword = this.shuffleArray(
      randPasswordArray.map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
    ).join('');

    this.form.controls['password'].patchValue(generatedPassword);
  }

  shuffleArray(array: Array<string>) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  setValueForForm(breeder: any) {
    for (let propertyName in this.form.controls) {
      this.form.controls[propertyName].patchValue(breeder[propertyName]);
    }
  }
}
