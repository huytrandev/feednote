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
      path: '/breeders',
      title: 'Hộ chăn nuôi',
    },
    {
      path: '/cow-breeds',
      title: 'Giống bò',
    },
    {
      path: 'foods',
      title: 'Nguồn thức ăn',
    },
    {
      path: '/not',
      title: 'Khẩu phần ăn chuẩn',
    },
    {
      path: '/not',
      title: 'Nhu cầu dinh dưỡng',
    },
    {
      path: 'veterinary/statistic',
      title: 'Thống kê',
    }
  ];
  loading: boolean = true;
  currentYear = new Date().getFullYear();

  private _mobileQueryListener!: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  logout(): void {
    // this.authService.revokeToken();
    this.authService.logout();
  }
}
