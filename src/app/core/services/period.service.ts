import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '.';

import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PeriodService {
  private headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('x-session-key', this.authService.currentUserValue.token);

  constructor(private authService: AuthService, private http: HttpClient) {}

  getNutritionByPeriod(periodId: string) {
    return this.http.get<any>(`${env.apiUrl}/api/period/${periodId}`, {
      headers: this.headers,
    });
  }
}
