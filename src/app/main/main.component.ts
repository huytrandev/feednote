import { Component, OnInit } from '@angular/core';
import { AuthService, UserService } from '../core/services';

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
      path: 'qtv',
      title: 'Quản lý chung',
      icon: 'assets/icons/statistics.svg',
    },
    {
      path: 'qtv/nhat-ky-cho-an',
      title: 'Nhật ký cho ăn',
      icon: 'assets/icons/notes.svg',
    },
    {
      path: 'qtv/ho-chan-nuoi',
      title: 'Hộ chăn nuôi',
      icon: 'assets/icons/farmer.svg',
    },
    {
      path: 'giong-bo',
      title: 'Giống bò',
      icon: 'assets/icons/cow.svg',
    },
    {
      path: 'thuc-an',
      title: 'Thức ăn',
      icon: 'assets/icons/grass.svg',
    }
  ];

  adminNav = [
    {
      path: 'qtv',
      title: 'Quản lý chung',
      icon: 'assets/icons/statistics.svg',
    },
    {
      path: 'qtv/nhat-ky-cho-an',
      title: 'Nhật ký cho ăn',
      icon: 'assets/icons/notes.svg',
    },
    {
      path: 'qtv/nguoi-dung',
      title: 'Người dùng',
      icon: 'assets/icons/user-management.svg',
    },
    {
      path: '/qtv/khu-vuc',
      title: 'Khu vực',
      icon: 'assets/icons/map.svg',
    },
    {
      path: 'giong-bo',
      title: 'Giống bò',
      icon: 'assets/icons/cow.svg',
    },
    {
      path: 'thuc-an',
      title: 'Thức ăn',
      icon: 'assets/icons/grass.svg',
    },
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService,
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
