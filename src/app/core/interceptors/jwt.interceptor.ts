import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthService } from '../services';

const TOKEN_HEADER_KEY = 'x-session-key';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentToken: any = this.authService.currentTokenValue;
    const isLoggedIn = currentToken;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        headers: request.headers.set(TOKEN_HEADER_KEY, `Bearer ${currentToken}`),
      });
    }
    return next.handle(request);
  }
}
