import { Component, OnInit } from '@angular/core';
import { AuthService, UserService } from '../../core/services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  loading: boolean;
  isExpanded: boolean = true;
  currentUser!: any;
  managerNav = [
    {
      path: '/admin/feeding-diaries',
      title: 'Nhật ký cho ăn',
      icon: 'assets/icons/notes.svg',
    },
    {
      path: '/standard-meals',
      title: 'Khẩu phần ăn chuẩn',
      icon: 'assets/icons/standard-meal.svg',
    },
    {
      path: '/admin/farmers',
      title: 'Hộ chăn nuôi',
      icon: 'assets/icons/farmer.svg',
    },
    {
      path: '/cow-breeds',
      title: 'Giống bò',
      icon: 'assets/icons/cow.svg',
    },
    {
      path: '/foods',
      title: 'Thức ăn',
      icon: 'assets/icons/grass.svg',
    },
    {
      path: '/admin/statistic',
      title: 'Thống kê',
      icon: 'assets/icons/statistics.svg',
    },
  ];

  adminNav = [
    {
      path: '/admin/feeding-diaries',
      title: 'Nhật ký cho ăn',
      icon: 'assets/icons/notes.svg',
    },
    {
      path: '/standard-meals',
      title: 'Khẩu phần ăn chuẩn',
      icon: 'assets/icons/standard-meal.svg',
    },
    {
      path: '/admin/users',
      title: 'Người dùng',
      icon: 'assets/icons/user-management.svg',
    },
    {
      path: '/admin/areas',
      title: 'Khu vực',
      icon: 'assets/icons/map.svg',
    },
    {
      path: '/cow-breeds',
      title: 'Giống bò',
      icon: 'assets/icons/cow.svg',
    },
    {
      path: '/foods',
      title: 'Thức ăn',
      icon: 'assets/icons/grass.svg',
    },
    {
      path: '/admin/statistic',
      title: 'Thống kê',
      icon: 'assets/icons/statistics.svg',
    },
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.loading = true;
    this.userService.fetchPersonalInfo().subscribe((res) => {
      const { data, status } = res;
      if (status === false) {
        return this.authService.logout();
      }
      this.currentUser = data;
      this.loading = false;
    });
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
  }
}
