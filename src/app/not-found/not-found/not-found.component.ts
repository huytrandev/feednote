import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit, OnDestroy {
  timeOut: any;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.timeOut = setTimeout(() => {
      this.router.navigate(['/']);
    }, 10000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeOut);
  }
}
