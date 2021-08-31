import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment as env } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser')!)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${env.apiUrl}/api/auth/login`, { username, password })
      .pipe(
        map((response) => {
          if (response.status === false) {
            return response;
          }

          const user = response.data;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    location.reload();
  }

  revokeToken() {
    return this.http.get<any>(`${env.apiUrl}/api/auth/logout`, {
      headers: this.currentUserValue.token,
    });
  }

  changePassword(password: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-session-key': this.currentUserValue.token,
    });

    return this.http.put<any>(
      `${env.apiUrl}/api/auth/changePassword`,
      { password: password },
      { headers: headers }
    );
  }
}
