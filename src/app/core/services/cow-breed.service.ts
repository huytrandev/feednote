import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FilterDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CowBreedService {
  private API_URL = environment.API_URL

  constructor(private http: HttpClient) {}

  fetchCowBreeds(filter?: FilterDto) {
    const params = new HttpParams()
      .set('skip', filter?.skip ? String(filter?.skip) : '')
      .set('limit', filter?.limit ? String(filter?.limit) : '')
      .set('search', filter?.search ? String(filter?.search) : '')
      .set('sort', filter?.sort ? String(filter?.sort) : '');

    return this.http.get<any>(`${this.API_URL}/cowBreed`, { params });
  }

  fetchCowBreed(id: string) {
    return this.http.get<any>(`${this.API_URL}/cowBreed/${id}`);
  }

  fetchNutritionOfCowBreed(cowBreedId: string) {
    return this.http.get<any>(`${this.API_URL}/cowBreed/${cowBreedId}/nutrition`);
  }

  fetchFoodsOfCowBreed(cowBreedId: string) {
    return this.http.get<any>(`${this.API_URL}/cowBreed/${cowBreedId}/foods`);
  }

  fetchPeriod(periodId: string) {
    return this.http.get<any>(`${this.API_URL}/period/${periodId}`);
  }

  createCowBreed(cowBreed: any) {
    return this.http.post<any>(
      `${this.API_URL}/cowBreed`,
      JSON.stringify(cowBreed)
    );
  }

  createNutritionOfPeriod(periodId: string, nutrition: any) {
    return this.http.post<any>(
      `${this.API_URL}/period/${periodId}/nutrition`,
      JSON.stringify(nutrition)
    );
  }

  updateCowBreed(id: string, cowBreed: any) {
    return this.http.put<any>(
      `${this.API_URL}/cowBreed/${id}`,
      JSON.stringify(cowBreed)
    );
  }

  updatePeriod(periodId: string, period: any) {
    return this.http.put<any>(
      `${this.API_URL}/period/${periodId}`,
      JSON.stringify(period)
    );
  }

  updateNutritionOfPeriod(periodId: string, nutrition: any) {
    return this.http.put<any>(
      `${this.API_URL}/period/${periodId}/nutrition/${nutrition.idNutrition}`,
      JSON.stringify(nutrition)
    );
  }

  deleteCowBreed(id: string) {
    return this.http.delete<any>(`${this.API_URL}/cowBreed/${id}`);
  }

  deletePeriod(periodId: string) {
    return this.http.delete<any>(`${this.API_URL}/period/${periodId}`);
  }

  deleteNutritionOfPeriod(periodId: string, nutritionId: string) {
    return this.http.delete<any>(
      `${this.API_URL}/period/${periodId}/nutrition/${nutritionId}`
    );
  }
}
