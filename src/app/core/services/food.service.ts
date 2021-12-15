import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AdvancedFilter } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private API_URL = environment.API_URL

  constructor(private http: HttpClient) {}

  fetchFoods(input?: AdvancedFilter) {
    const params = new HttpParams()
      .set('skip', input?.skip ? String(input?.skip) : '')
      .set('limit', input?.limit ? String(input?.limit) : '')
      .set('search', input?.search ? String(input?.search) : '')
      .set('sort', input?.sort ? String(input?.sort) : '')
      .set('filter', input?.filter ? JSON.stringify(input.filter) : '');

    return this.http.get<any>(`${this.API_URL}/food`, { params });
  }

  fetchFood(id: string) {
    return this.http.get<any>(`${this.API_URL}/food/${id}`);
  }

  createFood(food: any) {
    return this.http.post<any>(`${this.API_URL}/food`, JSON.stringify(food));
  }

  updateFood(id: string, food: any) {
    return this.http.put<any>(`${this.API_URL}/food/${id}`, JSON.stringify(food));
  }

  deleteFood(id: string) {
    return this.http.delete<any>(`${this.API_URL}/food/${id}`);
  }

  deleteIngredientOfFood(foodId: string, ingredientId: string) {
    return this.http.delete<any>(
      `${this.API_URL}/food/${foodId}/ingredient/${ingredientId}`
    );
  }
}
