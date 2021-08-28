import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  Optional,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaService } from 'src/app/_services/area.service';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss'],
})
export class DialogFormComponent implements OnInit, AfterViewInit {
  title: string = '';
  local_data: any;
  areas: any[];
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private areaSerive: AreaService
  ) {
    this.title =
      data.type === 'add' ? 'Thêm mới thức ăn' : 'Cập nhật thông tin thức ăn';
  }

  ngOnInit(): void {
    this.getArea();
  }

  ngAfterViewInit(): void {
    // this.getArea();
  }

  onSave() {
    this.dialogRef.close({ event: this.title, data: this.local_data });
  }

  onClose() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  getArea() {
    this.loading = true;
    this.areaSerive.getAll().subscribe((res) => {
      const { data } = res;
      this.areas = data.items;
      this.loading = false;
    });
  }
}
