import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CommonService, CowBreedService } from 'src/app/core/services';
import { FilterDto } from 'src/app/core/models';
import { DialogComponent } from 'src/app/shared';
import { CreateUpdateComponent } from '../create-update/create-update.component';
import { CREATE_UPDATE_DIALOG_CONFIG } from 'src/app/core/constant/create-update-dialog.config';
import { DELETE_DIALOG_CONFIG } from 'src/app/core/constant';

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
  cowBreeds: any = {};
  dataTableSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'farmingTime', 'actions'];
  defaultPageSize = 10;
  paramsGetCowBreeds = {} as FilterDto;
  defaultSort = 'createdAt desc';
  totalCount: number;
  currentCowBreedId!: string;
  selectedElement!: any;
  detailLoading: boolean = true;
  timeOutInput!: any;

  constructor(
    public dialog: MatDialog,
    private commonService: CommonService,
    private cowBreedService: CowBreedService
  ) {}

  ngOnInit(): void {
    this.setParams(0, this.defaultPageSize, '', this.defaultSort);
    this.getCowBreeds();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setParams(skip: number, limit: number, search: string, sort: string) {
    this.paramsGetCowBreeds = {
      skip,
      limit,
      search,
      sort,
    };
  }

  getCowBreeds(): void {
    this.loading = true;
    this.cowBreedService
      .fetchCowBreeds(this.paramsGetCowBreeds)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { data } = res;
        this.totalCount = data.totalCount ? data.totalCount : 0
        let cowBreeds: any[] = []
        if (data && data.items && data.items.length > 0) {
          cowBreeds = data.items
        }
        this.dataTableSource = new MatTableDataSource(cowBreeds)
        this.loading = false;
      });
  }

  onSearch(e: any) {
    clearTimeout(this.timeOutInput);
    const input = e.target.value;

    this.timeOutInput = setTimeout(() => {
      if (input === '' || input.length === 0) {
        this.setParams(0, this.defaultPageSize, '', this.defaultSort);
        this.getCowBreeds();
        return;
      }

      this.setParams(0, this.defaultPageSize, input, this.defaultSort);
      this.getCowBreeds();
    }, 500);
  }

  onSort(e: any) {
    const { active, direction } = e;

    const limit = this.paginator.pageSize;
    const skip = limit * this.paginator.pageIndex;

    if (direction === '') {
      this.setParams(skip, limit, '', this.defaultSort);
    } else {
      const sortQuery = `${active} ${direction}`;
      this.setParams(skip, limit, '', sortQuery);
    }

    this.getCowBreeds();
  }

  onPagination(e: any) {
    const limit = e.pageSize;
    const skip = e.pageIndex * limit;
    const { active, direction } = this.sort;
    let sortQuery = active ? `${active} ${direction}` : this.defaultSort;
    this.setParams(skip, limit, '', sortQuery);
    this.getCowBreeds();
  }

  onDelete(element: any): void {
    const dialogRef = this.dialog.open(DialogComponent, DELETE_DIALOG_CONFIG);

    const { _id } = element;
    dialogRef.afterClosed().subscribe((result) => {
      const { action } = result;
      if (action === 'delete') {
        this.loading = true;
        this.cowBreedService.deleteCowBreed(_id).subscribe((res) => {
          const { status } = res;
          if (status === true) {
            this.commonService.openAlert('Xoá giống bò thành công', 'success');
            this.getCowBreeds();
          } else {
            this.commonService.openAlert('Xoá giống bò thất bại', 'danger');
          }
        });
      }
    });
  }

  createUpdateCowBreed(cowBreedId?: string) {
    const dialogRef = this.dialog.open(CreateUpdateComponent, {
      ...CREATE_UPDATE_DIALOG_CONFIG,
      data: {
        cowBreedId
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      const { type, status, isModified } = res;
      if (type === 'create' && status === 'success') {
        this.commonService.openAlert('Tạo giống bò thành công', 'success');
        this.getCowBreeds();
      } else if (type === 'create' && status === 'fail') {
        this.commonService.openAlert('Tạo giống bò thất bại', 'danger');
      } else if (type === 'update' && status === 'success') {
        this.commonService.openAlert('Cập nhật giống bò thành công', 'success');
        this.getCowBreeds();
      } else if (type === 'update' && status === 'fail') {
        this.commonService.openAlert('Cập nhật giống bò thất bại', 'danger');
      } else if (type === 'close' && isModified) {
        this.getCowBreeds();
      } else if (type === 'close' && !isModified) {
        return;
      }
    });
  }
}
