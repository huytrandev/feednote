import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { FilterDto } from '../models/filter';

import { AuthService } from '.';

@Injectable({
  providedIn: 'root',
})
export class CowBreedService {
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('x-session-key', this.authService.currentUserValue.token);

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll(filter?: FilterDto) {
    const params = new HttpParams()
      .set('skip', filter?.skip?.toString() || '')
      .set('limit', filter?.limit?.toString() || '')
      .set('search', filter?.search?.toString() || '')
      .set('sort', filter?.sort?.toString() || '');

    const options = {
      headers: this.headers,
      params,
    };

    return this.http.get<any>(`${env.apiUrl}/api/cowBreed`, options);
  }

  getById(id: string) {
    return this.http.get<any>(`${env.apiUrl}/api/cowBreed/${id}`, {
      headers: this.headers,
    });
  }

  create(cowBreed: any) {
    return this.http.post<any>(
      `${env.apiUrl}/api/cowBreed`,
      JSON.stringify(cowBreed),
      {
        headers: this.headers,
      }
    );
  }

  update(id: string, cowBreed: any) {
    return this.http.put<any>(
      `${env.apiUrl}/api/cowBreed/${id}`,
      JSON.stringify(cowBreed),
      { headers: this.headers }
    );
  }

  delete(id: string) {
    return this.http.delete<any>(`${env.apiUrl}/api/cowBreed/${id}`, {
      headers: this.headers,
    });
  }

  deletePeriod(periodId: string) {
    return this.http.delete<any>(`${env.apiUrl}/api/period/${periodId}`, {
      headers: this.headers,
    });
  }
}
