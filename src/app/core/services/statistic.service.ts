import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { AdvancedFilter } from '../models';

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  constructor(private http: HttpClient) {}

  fetchCowIndicatorsStatistic(query: AdvancedFilter) {
    const params = new HttpParams()
      .set('filter', JSON.stringify(query.filter))
      .set('from', query.from ? String(query.from) : '')
      .set('to', query.to ? String(query.to) : '')
      .set('groupBy', 'period');

    return this.http.get<any>(`${env.apiUrl}/cow/statistic`, { params });
  }

  fetchAmountFoodForCowStatistic(query: AdvancedFilter) {
    const params = new HttpParams()
      .set('filter', JSON.stringify(query?.filter))
      .set('from', String(query.from) || '')
      .set('to', String(query.to) || '')
      .set('groupBy', 'food');

    return this.http.get<any>(`${env.apiUrl}/cow/statistic`, { params });
  }
}
