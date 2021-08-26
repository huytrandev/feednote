import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-session-key': this.authService.currentUserValue.token,
  });

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserInfoById(id: string) {
    return this.http.get<any>(`${env.apiUrl}/api/user/${id}`, {
      headers: this.headers,
    });
  }

  getAdminInfoById(id: string) {
    return this.http.get<any>(`${env.apiUrl}/api/admin/user/${id}`, {
      headers: this.headers,
    });
  }

  getVeterinaryInfoById(id: string) {
    return this.http.get<any>(`${env.apiUrl}/api/manager/user/${id}`, {
      headers: this.headers,
    });
  }

  updateUserInfo(input: any) {
    return this.http.put<any>(
      `${env.apiUrl}/api/auth/update`,
      JSON.stringify(input),
      {
        headers: this.headers,
      }
    );
  }
}
