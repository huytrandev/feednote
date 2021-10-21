import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { Area, FilterDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  constructor(private http: HttpClient) {}

  fetchAreas(filter?: FilterDto) {
    const params = new HttpParams()
      .set('skip', filter?.skip ? String(filter?.skip) : '')
      .set('limit', filter?.limit ? String(filter?.limit) : '')
      .set('search', filter?.search ? String(filter?.search) : '')
      .set('sort', filter?.sort ? String(filter?.sort) : '');

    return this.http.get<any>(`${env.apiUrl}/area`, { params });
  }

  fetchArea(id: string) {
    return this.http.get<any>(`${env.apiUrl}/area/${id}`);
  }

  createArea(area: Area) {
    return this.http.post<any>(`${env.apiUrl}/area`, JSON.stringify(area));
  }

  updateArea(areaId: string, area: Area) {
    return this.http.put<any>(
      `${env.apiUrl}/area/${areaId}`,
      JSON.stringify(area)
    );
  }

  deleteArea(areaId: string) {
    return this.http.delete<any>(`${env.apiUrl}/area/${areaId}`);
  }
}
