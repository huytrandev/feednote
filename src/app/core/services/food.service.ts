import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { FilterDto } from '../models';
import { AuthService } from '.';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');

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

    return this.http.get<any>(`${env.apiUrl}/food`, options);
  }

  getById(id: string) {
    return this.http.get<any>(`${env.apiUrl}/food/${id}`, {
      headers: this.headers,
    });
  }

  create(food: any) {
    return this.http.post<any>(`${env.apiUrl}/food`, JSON.stringify(food), {
      headers: this.headers,
    });
  }

  update(id: string, food: any) {
    return this.http.put<any>(
      `${env.apiUrl}/food/${id}`,
      JSON.stringify(food),
      {
        headers: this.headers,
      }
    );
  }

  delete(id: string) {
    return this.http.delete<any>(`${env.apiUrl}/food/${id}`, {
      headers: this.headers,
    });
  }

  deleteIngredient(foodId: string, ingredientId: string) {
    return this.http.delete<any>(
      `${env.apiUrl}/food/${foodId}/ingredient/${ingredientId}`,
      { headers: this.headers }
    );
  }
}
