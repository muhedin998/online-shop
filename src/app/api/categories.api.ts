import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProductCategoryDto } from './models/product.dto';

@Injectable({ providedIn: 'root' })
export class CategoriesApiService {
  private base = `${environment.apiBaseUrl}/categories`;
  constructor(private http: HttpClient) {}

  list(): Observable<ProductCategoryDto[]> {
    return this.http.get<ProductCategoryDto[]>(`${this.base}`);
  }

  getById(id: number): Observable<ProductCategoryDto> {
    return this.http.get<ProductCategoryDto>(`${this.base}/${id}`);
  }

  create(body: { name: string; description?: string }): Observable<ProductCategoryDto> {
    return this.http.post<ProductCategoryDto>(`${this.base}`, body);
  }

  update(id: number, body: { name: string; description?: string }): Observable<ProductCategoryDto> {
    return this.http.put<ProductCategoryDto>(`${this.base}/${id}` , body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
