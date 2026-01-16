import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = 'http://localhost:9090/api'; // Matches api.js default

  constructor(private http: HttpClient) {}

  getCompanyConfig(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/config`).pipe(
      catchError((error) => {
        console.error('Error fetching company config', error);
        return of({ name: 'Café Aroma' }); // Fallback
      })
    );
  }

  updateCompanyConfig(config: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/config`, config);
  }
}
