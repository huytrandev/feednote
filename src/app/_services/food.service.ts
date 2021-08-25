import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-session-key': this.authService.currentUserValue.token,
  });

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll() {
    return this.http.get<any>(`${env.apiUrl}/api/food`, {
      headers: this.headers,
    });
  }
}
