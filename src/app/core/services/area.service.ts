import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  protected headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('x-session-key', this.authService.currentUserValue.token);

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll() {
    return this.http.get<any>(`${env.apiUrl}/area`, {
      headers: this.headers,
    });
  }

  getById(id: string) {
    return this.http.get<any>(`${env.apiUrl}/area/${id}`, {
      headers: this.headers,
    });
  }
}
