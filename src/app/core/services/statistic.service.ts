import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AdvancedFilter } from '../models';

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  private API_URL = environment.API_URL

  constructor(private http: HttpClient) {}

  fetchCowStatistic(query: AdvancedFilter) {
    const params = new HttpParams()
      .set('filter', JSON.stringify(query.filter))
      .set('from', query.from ? String(query.from) : '')
      .set('to', query.to ? String(query.to) : '')
      .set('groupBy', query.groupBy ? String(query.groupBy) : '');

    return this.http.get<any>(`${this.API_URL}/cow/statistic`, { params });
  }
}
