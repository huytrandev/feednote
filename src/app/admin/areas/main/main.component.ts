import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DELETE_DIALOG_CONFIG } from 'src/app/core/constant';
import { CREATE_UPDATE_DIALOG_CONFIG } from 'src/app/core/constant/create-update-dialog.config';
import { Area, FilterDto } from 'src/app/core/models';
import { AreaService, CommonService } from 'src/app/core/services';
import { DialogComponent } from 'src/app/shared';
import { CreateUpdateDialogComponent } from '../create-update-dialog/create-update-dialog.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = true;
  dataTableSource: MatTableDataSource<Area>;
  displayedColumns: string[] = ['id', 'name', 'actions'];
  params!: FilterDto;
  defaultSort = 'createdAt desc';
  defaultPageSize = 10;
  totalCount: number = 0;
  timeOutInput!: any;

  constructor(
    public dialog: MatDialog,
    private areaService: AreaService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getAreas();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setParams(skip?: number, limit?: number, search?: string, sort?: string) {
    this.params = {
      skip,
      limit,
      search,
      sort,
    };
  }

  getAreas(): void {
    this.loading = true;
    this.areaService
      .fetchAreas(this.params)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { status, data } = res;
        if (!status) {
          this.loading = false;
          return;
        }
        this.totalCount = data.totalCount;
        this.dataTableSource = new MatTableDataSource(data.items);
        this.loading = false;
      });
  }

  onPagination(e: any) {
    const limit = e.pageSize;
    const skip = e.pageIndex * limit;
    let sortQuery = this.defaultSort;
    this.setParams(skip, limit, undefined, sortQuery);
    this.getAreas();
  }

  onDelete(element: any) {
    const dialogRef = this.dialog.open(DialogComponent, DELETE_DIALOG_CONFIG);

    const { _id } = element;

    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.areaService.deleteArea(_id).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert('Xoá thức ăn thành công', 'success');
            this.getAreas();
          } else {
            this.commonService.openAlert('Xoá thức ăn thất bại', 'danger');
          }
        });
      }
    });
  }

  createUpdateArea(area?: any) {
    const dialogRef = this.dialog.open(CreateUpdateDialogComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      data: {
        area,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      const { type, status } = res;
      if (type === 'create' && status === 'success') {
        this.commonService.openAlert('Tạo khu vực thành công', 'success');
        this.getAreas();
      } else if (type === 'create' && status === 'failure') {
        this.commonService.openAlert('Tạo khu vực thất bại', 'danger');
      } else if (type === 'update' && status === 'success') {
        this.commonService.openAlert('Cập nhật khu vực thành công', 'success');
        this.getAreas();
      } else if (type === 'update' && status === 'failure') {
        this.commonService.openAlert('Cập nhật khu vực thất bại', 'danger');
      }
    });
  }

  viewOnMap(area: any) {
    window.open(`https://www.google.com/maps/place/${area.name}`, '_blank');
  }
}
