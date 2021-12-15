import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.API_URL
  // private currentUserSubject: BehaviorSubject<any>;
  // public currentUser: Observable<any>;

  private currentTokenSubject: BehaviorSubject<any>;
  public currentToken: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentTokenSubject = new BehaviorSubject<any>(
      localStorage.getItem('token')
    );
    this.currentToken = this.currentTokenSubject.asObservable();
  }

  public get currentTokenValue(): any {
    return this.currentTokenSubject.value;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${this.API_URL}/auth/login`, { username, password })
      .pipe(
        map((res) => {
          const { status, data } = res;
          if (!status) {
            return res;
          }

          const userData = { ...data };
          if (userData.role === 'breeder') {
            return {
              status: false,
              message: 'is breeder',
            };
          }
          const token = userData.token.replace('Bearer ', '');
          this.currentTokenSubject.next(token);
          localStorage.setItem('token', token);
          return userData;
        })
      );
  }

  logout() {
    this.revokeToken();
    localStorage.removeItem('token');
    this.currentTokenSubject.next(null);
    location.reload();
  }

  revokeToken() {
    return this.http.get<any>(`${this.API_URL}/auth/logout`);
  }

  changePassword(password: string) {
    return this.http.put<any>(`${this.API_URL}/user/changePassword`, {
      password,
    });
  }

  resetPassword(userId: string) {
    return this.http.put<any>(
      `${this.API_URL}/admin/user/${userId}/resetPassword`,
      null
    );
  }

  getDecodeAccessToken(token: string) {
    try {
      return jwt_decode(token);
    } catch (err) {
      return null;
    }
  }

  getUserInfo() {
    const token = this.currentTokenValue;
    return this.getDecodeAccessToken(token);
  }
}
