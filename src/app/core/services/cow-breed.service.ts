import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { FilterDto } from '../models';

import { AuthService } from '.';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CowBreedService {
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  getStandardServingFile(cowBreedId: string) {
    const options = {
      headers: this.headers,
      responseType: 'blob' as 'json',
    };

    return this.http.get<any>(
      `${env.apiUrl}/cowBreed/${cowBreedId}/food`,
      options
    );
  }

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

    return this.http.get<any>(`${env.apiUrl}/cowBreed`, options);
  }

  getById(id: string) {
    return this.http.get<any>(`${env.apiUrl}/cowBreed/${id}`, {
      headers: this.headers,
    });
  }

  getNutritionByCowBreed(cowBreedId: string) {
    return this.http.get<any>(
      `${env.apiUrl}/cowBreed/${cowBreedId}/nutrition`,
      {
        headers: this.headers,
      }
    );
  }

  getPeriod(periodId: string) {
    return this.http.get<any>(`${env.apiUrl}/period/${periodId}`, {
      headers: this.headers,
    });
  }

  getFoodByCowBreed(cowBreedId: string) {
    return this.http.get<any>(`${env.apiUrl}/cowBreed/${cowBreedId}/foods`, {
      headers: this.headers,
    });
  }

  create(cowBreed: any) {
    return this.http.post<any>(
      `${env.apiUrl}/cowBreed`,
      JSON.stringify(cowBreed),
      {
        headers: this.headers,
      }
    );
  }

  createNutritionByPeriod(periodId: string, nutrition: any) {
    return this.http.post<any>(
      `${env.apiUrl}/period/${periodId}/nutrition`,
      JSON.stringify(nutrition),
      { headers: this.headers }
    );
  }

  update(id: string, cowBreed: any) {
    return this.http.put<any>(
      `${env.apiUrl}/cowBreed/${id}`,
      JSON.stringify(cowBreed),
      { headers: this.headers }
    );
  }

  updatePeriod(periodId: string, period: any) {
    return this.http.put<any>(
      `${env.apiUrl}/period/${periodId}`,
      JSON.stringify(period),
      { headers: this.headers }
    );
  }

  updateNutrition(periodId: string, nutrition: any) {
    return this.http.put<any>(
      `${env.apiUrl}/period/${periodId}/nutrition/${nutrition.idNutrition}`,
      JSON.stringify(nutrition),
      {
        headers: this.headers,
      }
    );
  }

  delete(id: string) {
    return this.http.delete<any>(`${env.apiUrl}/cowBreed/${id}`, {
      headers: this.headers,
    });
  }

  deletePeriod(periodId: string) {
    return this.http.delete<any>(`${env.apiUrl}/period/${periodId}`, {
      headers: this.headers,
    });
  }

  deleteNutrition(periodId: string, nutritionId: string) {
    return this.http.delete<any>(
      `${env.apiUrl}/period/${periodId}/nutrition/${nutritionId}`,
      { headers: this.headers }
    );
  }
}
