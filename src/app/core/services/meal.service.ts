import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { AdvancedFilter, Food } from '../models';

export interface ParamsForMealFile {
  idCowBreed: string;
  idArea: string;
}

@Injectable({
  providedIn: 'root',
})
export class MealService {
  constructor(private http: HttpClient) {}

  fetchMeals(input?: AdvancedFilter) {
    const params = new HttpParams()
      .set('filter', input?.filter ? JSON.stringify(input.filter) : '')
      .set('skip', input?.skip ? String(input.skip) : '')
      .set('limit', input?.limit ? String(input.limit) : '')
      .set('search', input?.search ? String(input.search) : '')
      .set('sort', input?.sort ? String(input.sort) : '');

    return this.http.get<any>(`${env.apiUrl}/meal`, { params });
  }

  fetchMeal(mealId: string) {
    return this.http.get<any>(`${env.apiUrl}/meal/${mealId}`);
  }

  fetchMealDataFile(filter: ParamsForMealFile) {
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {
      responseType: 'blob' as 'json',
      params,
    };
    
    return this.http.get<any>(`${env.apiUrl}/meal/file`, options);
  }

  createMeal(meal: any) {
    return this.http.post<any>(`${env.apiUrl}/meal/create`, JSON.stringify(meal));
  }

  createFoodOfMeal(mealId: string, foods: Food) {
    return this.http.post<any>(
      `${env.apiUrl}/meal/${mealId}/food`,
      JSON.stringify(foods)
    );
  }

  saveMeal(meal: any) {
    return this.http.post<any>(`${env.apiUrl}/meal`, JSON.stringify(meal));
  }

  updateFoodOfMeal(mealId: string, foodId: string, foods: Food) {
    return this.http.put<any>(
      `${env.apiUrl}/meal/${mealId}/food/${foodId}`,
      JSON.stringify(foods)
    );
  }

  deleteMeal(mealId: string) {
    return this.http.delete<any>(`${env.apiUrl}/meal/${mealId}`);
  }

  deleteFood(mealId: string, foodId: string) {
    return this.http.delete<any>(`${env.apiUrl}/meal/${mealId}/food/${foodId}`);
  }
}
