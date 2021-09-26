import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  user!: any;

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const expectedRole = route.data['expectedRole'];
    this.user = this.authService.getUserByToken();

    if (!this.user) {
      this.authService.logout();
      return false;
    }

    const { role } = this.user;
    if (expectedRole.includes(role)) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
