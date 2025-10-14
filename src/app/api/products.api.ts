import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CreateProductRequestDto, Page, ProductDto, UpdateProductRequestDto } from './models/product.dto';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private base = `${environment.apiBaseUrl}/products`;
  constructor(private http: HttpClient) {}

  getFeatured(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.base}/featured`);
  }

  list(page?: number, size?: number, sort?: string): Observable<Page<ProductDto>> {
    let params = new HttpParams();
    if (page != null) params = params.set('page', String(page));
    if (size != null) params = params.set('size', String(size));
    if (sort) params = params.set('sort', sort);
    return this.http.get<Page<ProductDto>>(`${this.base}`, { params });
  }

  getById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.base}/${id}`);
  }

  search(params: {
    searchText?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    inStock?: boolean;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<Page<ProductDto>> {
    let hp = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null) hp = hp.set(k, String(v));
    });
    return this.http.get<Page<ProductDto>>(`${this.base}/search`, { params: hp });
  }

  create(body: CreateProductRequestDto): Observable<ProductDto> {
    return this.http.post<ProductDto>(`${this.base}`, body);
  }

  update(productId: number, body: UpdateProductRequestDto): Observable<ProductDto> {
    return this.http.put<ProductDto>(`${this.base}/update/${productId}`, body);
  }

  delete(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${productId}`);
  }
}
