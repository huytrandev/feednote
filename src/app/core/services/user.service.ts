import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AdvancedFilter } from '../models';

import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.API_URL

  constructor(private http: HttpClient) {}

  // User
  fetchUsers(input?: AdvancedFilter) {
    const params = new HttpParams()
      .set('skip', input?.skip ? String(input?.skip) : '')
      .set('limit', input?.limit ? String(input?.limit) : '')
      .set('search', input?.search ? String(input?.search) : '')
      .set('sort', input?.sort ? String(input?.sort) : '')
      .set('filter', input?.filter ? JSON.stringify(input.filter) : '');

    return this.http.get<any>(`${this.API_URL}/admin/user`, { params });
  }

  fetchUser(id: string) {
    return this.http.get<any>(`${this.API_URL}/admin/user/${id}`);
  }

  createUser(user: User) {
    return this.http.post<any>(
      `${this.API_URL}/admin/user`,
      JSON.stringify(user)
    );
  }

  updateUser(userId: string, user: User) {
    return this.http.put<any>(
      `${this.API_URL}/admin/user/${userId}`,
      JSON.stringify(user)
    );
  }

  deleteUser(userId: string) {
    return this.http.delete<any>(`${this.API_URL}/admin/user/${userId}`);
  }

  // Breeder
  fetchBreeders(input?: AdvancedFilter) {
    const params = new HttpParams()
      .set('skip', input?.skip ? String(input?.skip) : '')
      .set('limit', input?.limit ? String(input?.limit) : '')
      .set('search', input?.search ? String(input?.search) : '')
      .set('sort', input?.sort ? String(input?.sort) : '')
      .set('filter', input?.filter ? JSON.stringify(input.filter) : '');

    return this.http.get<any>(`${this.API_URL}/user/getAllBreeder`, { params });
  }

  fetchBreeder(breederId: string) {
    return this.http.get<any>(`${this.API_URL}/user/${breederId}`);
  }

  createBreeder(breeder: User) {
    return this.http.post<any>(`${this.API_URL}/user`, JSON.stringify(breeder));
  }

  updateBreeder(breederId: string, breeder: User) {
    return this.http.put<any>(
      `${this.API_URL}/user/${breederId}`,
      JSON.stringify(breeder)
    );
  }

  deleteBreeder(breederId: string) {
    return this.http.delete<any>(`${this.API_URL}/user/${breederId}`);
  }

  // Manager
  fetchManagers() {
    const params = new HttpParams().set(
      'filter',
      JSON.stringify({ role: 'manager' })
    );

    return this.http.get<any>(`${this.API_URL}/admin/user`, { params });
  }

  // Personal
  fetchPersonalInfo() {
    return this.http.get<any>(`${this.API_URL}/user/info`);
  }

  updatePersonalInfo(input: any) {
    return this.http.put<any>(
      `${this.API_URL}/user/update`,
      JSON.stringify(input)
    );
  }
}
