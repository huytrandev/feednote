import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AdvancedFilter } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FeedingDiaryService {
  private API_URL = environment.API_URL
  
  constructor(private http: HttpClient) {}

  fetchFeedingDiaries(inputParams?: AdvancedFilter) {
    const params = new HttpParams()
      .set('skip', inputParams?.skip ? String(inputParams?.skip) : '')
      .set('limit', inputParams?.limit ? String(inputParams?.limit) : '')
      .set('search', inputParams?.search ? String(inputParams?.search) : '')
      .set('sort', inputParams?.sort ? String(inputParams?.sort) : '')
      .set('from', inputParams?.from ? String(inputParams?.from) : '')
      .set('to', inputParams?.to ? String(inputParams?.to) : '')
      .set('filter', inputParams?.filter ? JSON.stringify(inputParams?.filter) : '');

    return this.http.get<any>(`${this.API_URL}/diaryFeed`, { params });
  }

  fetchFeedingDiaryById(feedingDiaryId: string) {
    return this.http.get<any>(`${this.API_URL}/diaryFeed/${feedingDiaryId}`);
  }
}
