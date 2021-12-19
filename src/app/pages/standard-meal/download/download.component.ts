import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { AreaService, CommonService, CowBreedService, MealService } from 'src/app/core/services';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>()
  form = new FormGroup({
    idCowBreed: new FormControl('', [Validators.required]),
    idArea: new FormControl('', [Validators.required]),
  });

  loading: boolean = false;
  submitted: boolean = false;
  selectedArea!: string;
  selectedCowBreed!: string;

  cowBreeds: any[] = []
  areas: any[] = [];

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DownloadComponent>,
    private areaService: AreaService,
    private cowBreedService: CowBreedService,
    private mealService: MealService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.fetchCowBreeds()
    this.fetchAreas()
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  fetchCowBreeds() {
    this.loading = true;
    this.cowBreedService
      .fetchCowBreeds()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.cowBreeds = res.data.items;
        this.loading = false;
      });
  }

  fetchAreas() {
    this.loading = true;
    this.areaService
      .fetchAreas()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.areas = res.data.items;
        this.loading = false;
      });
  }

  onClose() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.dialogRef.close();
  }

  onSubmit() {
    if (!this.form.valid) return;

    this.submitted = true;

    const params = {
      idCowBreed: this.form.get('idCowBreed')?.value,
      idArea: this.form.get('idArea')?.value,
    };

    this.mealService
      .fetchMealDataFile(params)
      .pipe(
        catchError((err) => {
          this.commonService.openAlert('Khẩu phần ăn không có sẵn', 'danger');
          this.submitted = false;
          throw err;
        })
      )
      .subscribe((res) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'standard-meal.pdf';
        link.click();
        this.submitted = false;
      });
  }
}
