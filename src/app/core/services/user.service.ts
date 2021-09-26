import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { FilterDto } from '../models';
import { AuthService } from './auth.service';

import { User } from '../models';

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

  // User
  getAllUsers(filter?: FilterDto) {
    const params = new HttpParams()
      .set('skip', filter?.skip?.toString() || '')
      .set('limit', filter?.limit?.toString() || '')
      .set('search', filter?.search?.toString() || '')
      .set('sort', filter?.sort?.toString() || '');

    const options = {
      headers: this.headers,
      params,
    };

    return this.http.get<any>(`${env.apiUrl}/api/admin/user`, options);
  }

  getUserById(id: string) {
    return this.http.get<any>(`${env.apiUrl}/api/admin/user/${id}`, {
      headers: this.headers,
    });
  }

  createUser(user: User) {
    return this.http.post<any>(`${env.apiUrl}/api/admin/user`, user, {
      headers: this.headers,
    });
  }

  updateUser(userId: string, user: User) {
    return this.http.put<any>(`${env.apiUrl}/api/admin/user/${userId}`, user, {
      headers: this.headers,
    });
  }

  deleteUser(userId: string) {
    return this.http.delete<any>(`${env.apiUrl}/api/admin/user/${userId}`, {
      headers: this.headers,
    });
  }

  // Breeder
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

  getBreederById(breederId: string) {
    return this.http.get<any>(`${env.apiUrl}/api/user/${breederId}`, {
      headers: this.headers,
    });
  }

  createBreeder(breeder: User) {
    return this.http.post<any>(
      `${env.apiUrl}/api/user`,
      JSON.stringify(breeder),
      { headers: this.headers }
    );
  }

  updateBreeder(breederId: string, breeder: User) {
    return this.http.put<any>(`${env.apiUrl}/api/user/${breederId}`, breeder, {
      headers: this.headers,
    });
  }

  deleteBreeder(breederId: string) {
    return this.http.delete<any>(`${env.apiUrl}/api/user/${breederId}`, {
      headers: this.headers,
    });
  }

  // Manager
  getAllManager() {
    const params = new HttpParams().set(
      'filter',
      JSON.stringify({ role: 'manager' })
    );

    const options = {
      headers: this.headers,
      params,
    };

    return this.http.get<any>(`${env.apiUrl}/api/admin/user`, options);
  }

  // Personal
  getPersonalInfo() {
    return this.http.get<any>(`${env.apiUrl}/api/user/info`, {
      headers: this.headers,
    });
  }

  updatePersonalInfo(input: any) {
    return this.http.put<any>(
      `${env.apiUrl}/api/user/update`,
      JSON.stringify(input),
      {
        headers: this.headers,
      }
    );
  }
}
