import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CowBreedService } from 'src/app/_services/cow-breed.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  currentId!: string;
  cowBreed: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cowBreedService: CowBreedService
  ) {
    this.currentId = this.route.snapshot.params.id;
    console.log(this.currentId);
  }

  ngOnInit(): void {
    this.getDetailCowBreed(this.currentId);
  }

  getDetailCowBreed(id: string) {
    this.cowBreedService.getById(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const { status, data } = res;
        if (status === false) {
          this.router.navigate(['cow-breed']);
          return;
        }

        this.cowBreed = data;
      })
  }
}
