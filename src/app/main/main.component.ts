import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  currentUser: any = null;
  isExpanded: boolean = true;
  mobileQuery!: MediaQueryList;
  fillerNav = [
    {
      path: 'admin/feeding-diary',
      title: 'Nhật ký cho ăn',
      icon: 'assets/icons/notes.svg',
    },
    {
      path: 'admin/breeders',
      title: 'Hộ chăn nuôi',
      icon: 'assets/icons/farmer.svg',
    },
    {
      path: 'cow-breeds',
      title: 'Giống bò',
      icon: 'assets/icons/cow.svg',
    },
    {
      path: 'foods',
      title: 'Nguồn thức ăn',
      icon: 'assets/icons/grass.svg',
    },
    {
      path: 'standard-servings',
      title: 'Khẩu phần ăn chuẩn',
      icon: 'assets/icons/scale.svg',
    },
    {
      path: 'not',
      title: 'Nhu cầu dinh dưỡng',
      icon: 'assets/icons/chemistry.svg',
    },
    {
      path: 'admin/statistic',
      title: 'Thống kê',
      icon: 'assets/icons/statistics.svg',
    },
  ];
  loading: boolean = true;
  currentYear = new Date().getFullYear();

  constructor(private authService: AuthService, private router: Router) {
    // this.currentUser = this.authService.currentUserValue;
    this.authService.currentUser.subscribe((user) => (this.currentUser = user));
  }

  ngOnInit(): void {}

  logout(): void {
    // this.authService.revokeToken();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
