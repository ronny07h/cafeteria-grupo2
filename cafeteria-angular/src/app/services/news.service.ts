import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = 'http://localhost:9090/api/news';

  constructor(private http: HttpClient) {}

  getAllNews(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createNews(news: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, news);
  }

  updateNews(id: number, news: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, news);
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
