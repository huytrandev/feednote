import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  snackBarConfiguration = {
    duration: 2700,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  constructor(private snackBar: MatSnackBar, private router: Router) {}

  openAlert(message: string, type: string, action?: string) {
    let config = new MatSnackBarConfig();
    Object.assign(config, this.snackBarConfiguration);
    config.panelClass =
      type === 'success'
        ? ['alert-success']
        : type === 'danger'
        ? ['alert-failure']
        : '';

    this.snackBar.open(message, action, config);
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
