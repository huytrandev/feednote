import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AreaService } from 'src/app/_services/area.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  breeder: any = null;
  loading: boolean = true;
  error: boolean = false;
  breederId: string = '';
  area$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private areaService: AreaService
  ) {
    this.breederId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.getBreeder();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getBreeder() {
    this.loading = true;
    this.userService
      .getBreederById(this.breederId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const { status } = res;
        if (!status) {
          this.error = true;
          this.loading = false;
          return;
        }

        let data = { ...res.data };
        this.area$ = this.areaService.getById(data.idArea);
        let createdAt = new Date(data.createdAt);
        this.breeder = { ...data, createdAt };
        this.loading = false;
      });
  }
}
