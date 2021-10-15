import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '.';

import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CowService {
  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) {}

  getById(cowId: string) {
    return this.http.get<any>(`${env.apiUrl}/cow/${cowId}`, {
      headers: this.headers,
    });
  }
}
