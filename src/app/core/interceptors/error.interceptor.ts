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
      retryWhen(error => 
        error.pipe(
          concatMap((err, count) => {
            if (count < 3 && err.status === 401) {
              return of(err);
            }

            this.authService.logout();
            return throwError(error);
          }),
          delay(1000)
      )),
      catchError((err) => {
        switch (err.status) {
          case 403:
            this.authService.logout();
            break;
          default:
            this.router.navigate(['/404']);
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
