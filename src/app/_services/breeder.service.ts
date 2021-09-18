import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilterDto } from '../_models/filter';
import { AuthService } from './auth.service';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BreederService {
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('x-session-key', this.authService.currentUserValue.token);

  constructor(private http: HttpClient, private authService: AuthService) { }

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

    return this.http.get<any>(`${env.apiUrl}/api/user/getAllBreeder`, options);
  }

  getById(id: string) {
    return this.http.get<any>(`${env.apiUrl}/api/user/getAllBreeder/${id}`, {
      headers: this.headers,
    });
  }
}
