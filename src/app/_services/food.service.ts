import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { FilterDto } from '../_models/filter';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('x-session-key', this.authService.currentUserValue.token);

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll(filter?: FilterDto) {
    const params = new HttpParams()
      .set('skip', filter?.skip || '')
      .set('limit', filter?.limit || '')
      .set('search', filter?.search || '');

    const options = {
      headers: this.headers,
      params,
    };

    return this.http.get<any>(`${env.apiUrl}/api/food`, options);
  }
}
