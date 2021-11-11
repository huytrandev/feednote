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
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const expectedRole = route.data['expectedRole'];
    const user: any = this.authService.getUserInfo();

    const { role } = user;
    if (expectedRole.includes(role)) {
      return true;
    } else {
      this.router.navigate(['/404']);
      return false;
    }
  }
}
