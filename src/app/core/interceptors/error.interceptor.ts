import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, retryWhen } from 'rxjs/operators';
import { AuthService } from '../services';
import { Router } from '@angular/router';

export const retryCount = 3;
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 404) {
          this.router.navigate(['/404']);
        } else if (err.status === 401) {
          this.authService.logout();
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
