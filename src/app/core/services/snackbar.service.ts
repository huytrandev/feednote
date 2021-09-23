import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private config: MatSnackBarConfig;

  constructor(private snackBar: MatSnackBar) {
    this.config = new MatSnackBarConfig();
    this.config.duration = 2000;
  }

  openSnackBar(
    message: string,
    type?: string,
    duration?: number,
    action?: string,
  ) {
    this.config = duration
      ? Object.assign(this.config, { duration: duration })
      : this.config;

    this.config.panelClass =
      type === 'success' ? ['green-snackbar'] : type === 'danger' ? ['red-snackbar'] : '';
    this.config.horizontalPosition = 'center';
    this.config.verticalPosition = 'top';
    this.snackBar.open(message, action, this.config);
  }
}
