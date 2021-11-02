import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { AdvancedFilter, FilterDto } from '../models';

import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // User
  fetchUsers(input?: AdvancedFilter) {
    const params = new HttpParams()
      .set('skip', input?.skip ? String(input?.skip) : '')
      .set('limit', input?.limit ? String(input?.limit) : '')
      .set('search', input?.search ? String(input?.search) : '')
      .set('sort', input?.sort ? String(input?.sort) : '')
      .set('filter', input?.filter ? JSON.stringify(input.filter) : '');

    return this.http.get<any>(`${env.apiUrl}/admin/user`, { params });
  }

  fetchUser(id: string) {
    return this.http.get<any>(`${env.apiUrl}/admin/user/${id}`);
  }

  createUser(user: User) {
    return this.http.post<any>(
      `${env.apiUrl}/admin/user`,
      JSON.stringify(user)
    );
  }

  updateUser(userId: string, user: User) {
    return this.http.put<any>(
      `${env.apiUrl}/admin/user/${userId}`,
      JSON.stringify(user)
    );
  }

  deleteUser(userId: string) {
    return this.http.delete<any>(`${env.apiUrl}/admin/user/${userId}`);
  }

  // Breeder
  fetchBreeders(input?: AdvancedFilter) {
    const params = new HttpParams()
      .set('skip', input?.skip ? String(input?.skip) : '')
      .set('limit', input?.limit ? String(input?.limit) : '')
      .set('search', input?.search ? String(input?.search) : '')
      .set('sort', input?.sort ? String(input?.sort) : '')
      .set('filter', input?.filter ? JSON.stringify(input.filter) : '');

    return this.http.get<any>(`${env.apiUrl}/user/getAllBreeder`, { params });
  }

  fetchBreeder(breederId: string) {
    return this.http.get<any>(`${env.apiUrl}/user/${breederId}`);
  }

  createBreeder(breeder: User) {
    return this.http.post<any>(`${env.apiUrl}/user`, JSON.stringify(breeder));
  }

  updateBreeder(breederId: string, breeder: User) {
    return this.http.put<any>(
      `${env.apiUrl}/user/${breederId}`,
      JSON.stringify(breeder)
    );
  }

  deleteBreeder(breederId: string) {
    return this.http.delete<any>(`${env.apiUrl}/user/${breederId}`);
  }

  // Manager
  fetchManagers() {
    const params = new HttpParams().set(
      'filter',
      JSON.stringify({ role: 'manager' })
    );

    return this.http.get<any>(`${env.apiUrl}/admin/user`, { params });
  }

  // Personal
  fetchPersonalInfo() {
    return this.http.get<any>(`${env.apiUrl}/user/info`);
  }

  updatePersonalInfo(input: any) {
    return this.http.put<any>(
      `${env.apiUrl}/user/update`,
      JSON.stringify(input)
    );
  }
}
