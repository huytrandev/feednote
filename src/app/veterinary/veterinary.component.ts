import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-veterinary',
  templateUrl: './veterinary.component.html',
  styleUrls: ['./veterinary.component.scss'],
})
export class VeterinaryComponent implements OnInit {
  mobileQuery!: MediaQueryList;
  fillerNav = [
    {
      path: 'manager',
      icon: 'edit_note',
      title: 'Note'
    },
    {
      path: 'statistic',
      icon: 'show_chart',
      title: 'Statistic'
    }
  ]
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
