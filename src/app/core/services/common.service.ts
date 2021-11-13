import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  snackBarConfiguration = {
    duration: 3000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  constructor(private snackBar: MatSnackBar, private router: Router) {}

  openAlert(
    message: string,
    type: 'success' | 'danger' | 'warning' | 'info',
    action?: string
  ) {
    let config = new MatSnackBarConfig();
    Object.assign(config, this.snackBarConfiguration);
    switch (type) {
      case 'success':
        config.panelClass = ['alert-success'];
        break;
      case 'danger':
        config.panelClass = ['alert-failure'];
        break;
      case 'warning':
        config.panelClass = ['alert-warning'];
        break;
      case 'info':
        config.panelClass = ['alert-info'];
        break;
      default:
      //
    }

    this.snackBar.open(message, action, config);
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
