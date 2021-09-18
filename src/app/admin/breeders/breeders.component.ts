import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterDto } from 'src/app/_models/filter';
import { BreederService } from 'src/app/_services/breeder.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-breeders',
  templateUrl: './breeders.component.html',
  styleUrls: ['./breeders.component.scss'],
})
export class BreedersComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = true;
  dataTableSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'phone',
    'actions',
  ];
  paramGetBreeders = {} as FilterDto;
  defaultSort = 'createdAt desc';
  defaultPageSize = 5;
  totalCount: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.setParams(0, this.defaultPageSize, '', this.defaultSort);
    this.getBreeders();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setParams(skip: number, limit: number, search: string, sort: string) {
    this.paramGetBreeders = {
      skip,
      limit,
      search,
      sort,
    };
  }

  getBreeders(): void {
    this.loading = true;
    this.userService
      .getAllBreeders()
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

  deleteBreeder(): void {
    
  }
}
