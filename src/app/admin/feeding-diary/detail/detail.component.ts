import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  loading: boolean = false;
  feedingDiary!: any;
  displayedColumns = ['id', 'name', 'amount', 'unit'];

  constructor(
    public dialogRef: MatDialogRef<DetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.feedingDiary = data.feedingDiary;
  }

  ngOnInit(): void {}

  onClose() {
    this.dialogRef.close();
  }

  transformDate(date: number) {
    return moment(date).locale('vi').format('LT, LL');
  }
}
