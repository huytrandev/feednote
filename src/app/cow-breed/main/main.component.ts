import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterDto } from 'src/app/_models/filter';
import { CowBreedService } from 'src/app/_services/cow-breed.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = true;
  cowBreeds: any = {};
  dataTableSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'id',
    'name',
    'farmingTime',
    'actions',
  ];
  defaultPageSize = 5;
  paramsGetCowBreeds = {} as FilterDto;
  defaultSort = 'createdAt desc';
  totalCount: number;
  expandedElement: any | null;

  constructor(
    private snackbar: SnackbarService,
    public dialog: MatDialog,
    private cowBreedService: CowBreedService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setParams(0, this.defaultPageSize, '', this.defaultSort);
    this.getCowBreeds();
  }

  ngOnDestroy(): void {
    // This aborts all HTTP requests.
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
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
    this.cowBreedService
      .getAll(this.paramsGetCowBreeds)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { data } = res;
        this.totalCount = data.totalCount;
        this.dataTableSource = new MatTableDataSource(data.items);
        this.loading = false;
      });
  }
}
