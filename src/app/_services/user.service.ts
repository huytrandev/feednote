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

  getUserById(id: string) {
    const token = this.authService.currentUserValue.token;
    return this.http.get<any>(`${env.apiUrl}/api/user/${id}`, { headers: this.headers });
  }
}
