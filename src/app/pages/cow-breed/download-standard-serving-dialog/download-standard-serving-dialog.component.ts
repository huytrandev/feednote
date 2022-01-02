import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { catchError, takeUntil } from 'rxjs/operators'
import { AreaService, CommonService, MealService } from 'src/app/core/services'

@Component({
  selector: 'app-download-standard-serving-dialog',
  templateUrl: './download-standard-serving-dialog.component.html',
  styleUrls: ['./download-standard-serving-dialog.component.scss'],
})
export class DownloadStandardServingDialogComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>()
  form = new FormGroup({
    idArea: new FormControl('', [Validators.required]),
  })
  loading: boolean = false
  submitted: boolean = false
  selectedArea!: string
  cowBreed!: any

  areas: any[] = []

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DownloadStandardServingDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private areaService: AreaService,
    private mealService: MealService,
    private commonService: CommonService
  ) {
    this.cowBreed = data.cowBreed
  }

  ngOnInit(): void {
    this.fetchAreas()
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  fetchAreas() {
    this.loading = true
    this.areaService
      .fetchAreas()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.areas = res.data.items
        this.loading = false
      })
  }

  onClose() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
    this.dialogRef.close()
  }

  onSubmit() {
    if (!this.form.valid) return

    this.submitted = true

    const params = {
      idCowBreed: this.cowBreed._id,
      idArea: this.form.get('idArea')?.value,
    }

    this.mealService
      .fetchMealDataFile(params)
      .pipe(
        catchError((err) => {
          this.commonService.openAlert('Khẩu phần ăn không có sẵn', 'danger')
          this.submitted = false
          throw err
        })
      )
      .subscribe((res) => {
        const blob = new Blob([res], { type: 'application/pdf' })
        var downloadURL = window.URL.createObjectURL(res)
        var link = document.createElement('a')
        link.href = downloadURL
        link.download = 'standard-meal.pdf'
        link.click()
        this.submitted = false
      })
  }
}
