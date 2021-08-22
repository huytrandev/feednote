import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  mobileQuery!: MediaQueryList;
  fillerNav = [
    {
      path: 'veterinary/manager',
      icon: 'edit_note',
      title: 'Note',
    },
    {
      path: 'veterinary/statistic',
      icon: 'show_chart',
      title: 'Statistic',
    },
  ];
  loading: boolean = true;
  currentYear = new Date().getFullYear();

  private _mobileQueryListener!: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
