import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { FilterDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor(private http: HttpClient) {}

  fetchFoods(filter?: FilterDto) {
    const params = new HttpParams()
      .set('skip', filter?.skip ? String(filter?.skip) : '')
      .set('limit', filter?.limit ? String(filter?.limit) : '')
      .set('search', filter?.search ? String(filter?.search) : '')
      .set('sort', filter?.sort ? String(filter?.sort) : '');

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
