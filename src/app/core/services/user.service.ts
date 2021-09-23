import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { FilterDto } from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-session-key': this.authService.currentUserValue.token,
    });
  }

  createBreeder(breeder: any) {
    return this.http.post<any>(
      `${env.apiUrl}/api/user`,
      JSON.stringify(breeder),
      { headers: this.headers }
    );
  }

  updateBreeder(id: string, breeder: any) {
    return this.http.put<any>(`${env.apiUrl}/api/user/${id}`, breeder, {
      headers: this.headers,
    });
  }

  getUserInfo() {
    return this.http.get<any>(`${env.apiUrl}/api/user/info`, {
      headers: this.headers,
    });
  }

  getAdminInfoById(id: string) {
    return this.http.get<any>(`${env.apiUrl}/api/admin/user/${id}`, {
      headers: this.headers,
    });
  }

  getAllBreeders(filter?: FilterDto) {
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

  getBreederById(id: string) {
    return this.http.get<any>(`${env.apiUrl}/api/user/${id}`, {
      headers: this.headers,
    });
  }

  updateUserInfo(input: any) {
    return this.http.put<any>(
      `${env.apiUrl}/api/auth/update`,
      JSON.stringify(input),
      {
        headers: this.headers,
      }
    );
  }

  deleteBreeder(id: string) {
    return this.http.delete<any>(`${env.apiUrl}/api/user/${id}`, {
      headers: this.headers,
    });
  }
}
