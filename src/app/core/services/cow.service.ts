import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CowService {
  private API_URL = environment.API_URL

  constructor(private http: HttpClient) {}

  fetchCow(cowId: string) {
    return this.http.get<any>(`${this.API_URL}/cow/${cowId}`);
  }
}
