import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CowService {
  constructor(private http: HttpClient) {}

  fetchCow(cowId: string) {
    return this.http.get<any>(`${env.apiUrl}/cow/${cowId}`);
  }
}
