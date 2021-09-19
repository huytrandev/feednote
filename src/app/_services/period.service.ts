import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { FilterDto } from '../_models/filter';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PeriodService {
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('x-session-key', this.authService.currentUserValue.token);

  constructor(private http: HttpClient, private authService: AuthService) {}

  delete(id: string) {
    return this.http.delete<any>(`${env.apiUrl}/api/period/${id}`, {
      headers: this.headers,
    });
  }
}
