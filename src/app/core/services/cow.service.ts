import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '.';

import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CowService {
  private headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('x-session-key', this.authService.currentUserValue.token);

  constructor(private http: HttpClient, private authService: AuthService) {}

  getById(cowId: string) {
    return this.http.get<any>(`${env.apiUrl}/api/cow/${cowId}`, {
      headers: this.headers,
    });
  }
}
