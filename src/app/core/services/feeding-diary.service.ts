import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '.';

import { environment as env } from 'src/environments/environment';
import { AdvancedFilter } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FeedingDiaryService {
  private headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('x-session-key', this.authService.currentUserValue.token);

  constructor(private authService: AuthService, private http: HttpClient) {}

  getAll(inputParams?: AdvancedFilter) {
    const params = new HttpParams()
      .set('skip', inputParams?.skip?.toString() || '')
      .set('limit', inputParams?.limit?.toString() || '')
      .set('search', inputParams?.search?.toString() || '')
      .set('sort', inputParams?.sort?.toString() || '')
      .set('from', inputParams?.from?.toString() || '')
      .set('to', inputParams?.to?.toString() || '')
      .set('filter', JSON.stringify(inputParams?.filter) || '');

    const options = {
      headers: this.headers,
      params,
    };

    return this.http.get<any>(`${env.apiUrl}/api/diaryFeed`, options);
  }

  getById(feedingDiaryId: string) {
    return this.http.get<any>(`${env.apiUrl}/api/diaryFeed/${feedingDiaryId}`, {
      headers: this.headers,
    });
  }
}
