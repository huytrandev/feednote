import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  currentUser: any = null;
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

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  logout(): void {
    this.authService.logout();
  }
}
