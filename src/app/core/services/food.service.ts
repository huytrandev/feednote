import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { AdvancedFilter, FilterDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor(private http: HttpClient) {}

  fetchFoods(input?: AdvancedFilter) {
    const params = new HttpParams()
      .set('skip', input?.skip ? String(input?.skip) : '')
      .set('limit', input?.limit ? String(input?.limit) : '')
      .set('search', input?.search ? String(input?.search) : '')
      .set('sort', input?.sort ? String(input?.sort) : '')
      .set('filter', input?.filter ? JSON.stringify(input.filter) : '');

    return this.http.get<any>(`${env.apiUrl}/food`, { params });
  }

  fetchFood(id: string) {
    return this.http.get<any>(`${env.apiUrl}/food/${id}`);
  }

  createFood(food: any) {
    return this.http.post<any>(`${env.apiUrl}/food`, JSON.stringify(food));
  }

  updateFood(id: string, food: any) {
    return this.http.put<any>(`${env.apiUrl}/food/${id}`, JSON.stringify(food));
  }

  deleteFood(id: string) {
    return this.http.delete<any>(`${env.apiUrl}/food/${id}`);
  }

  deleteIngredientOfFood(foodId: string, ingredientId: string) {
    return this.http.delete<any>(
      `${env.apiUrl}/food/${foodId}/ingredient/${ingredientId}`
    );
  }
}
