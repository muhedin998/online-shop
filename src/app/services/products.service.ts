import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { catchError, map, of } from 'rxjs';
import { MOCK_PRODUCTS } from '../data/mock-products';
import { ProductDto } from '../api/models/product.dto';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private base = environment.apiBaseUrl;

  // Cache signals for simple local state if needed by multiple components
  featuredSig = signal<Product[] | null>(null);

  constructor(private http: HttpClient) {}

  getFeatured() {
    return this.http
      .get<ProductDto[]>(`${this.base}/products/featured`)
      .pipe(
        map(list => (list || []).map(this.mapDtoToProduct)),
        catchError(() => of(MOCK_PRODUCTS))
      );
  }

  getAll(params?: { page?: number; size?: number; text?: string; category?: string }) {
    const q = new URLSearchParams();
    if (params?.page != null) q.set('page', String(params.page));
    if (params?.size != null) q.set('size', String(params.size));
    if (params?.text) q.set('text', params.text);
    if (params?.category) q.set('category', params.category);
    const qs = q.toString();
    const url = qs ? `${this.base}/products?${qs}` : `${this.base}/products`;
    return this.http
      .get<ProductDto[]>(url)
      .pipe(
        map(list => (list || []).map(this.mapDtoToProduct)),
        catchError(() => of(MOCK_PRODUCTS))
      );
  }

  getById(id: number) {
    return this.http
      .get<ProductDto>(`${this.base}/products/${id}`)
      .pipe(
        map(dto => this.mapDtoToProduct(dto)),
        catchError(() => of(MOCK_PRODUCTS.find(p => p.id === id)!))
      );
  }

  search(params: { searchText?: string; categoryId?: number; minPrice?: number; maxPrice?: number; featured?: boolean; inStock?: boolean; page?: number; size?: number; sort?: string; }) {
    const q: any = { ...params };
    return this.http
      .get<any>(`${this.base}/products/search`, { params: q })
      .pipe(
        map((page: any) => {
          const content = Array.isArray(page?.content) ? page.content as ProductDto[] : [];
          return content.map(this.mapDtoToProduct);
        }),
        catchError(() => of(MOCK_PRODUCTS))
      );
  }

  private mapDtoToProduct = (dto: ProductDto): Product => {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description || '',
      price: dto.price,
      imageUrl: dto.mainImageUrl || 'assets/placeholder-product.svg',
      rating: undefined,
      volume: undefined,
      tags: dto.featured ? ['featured'] : [],
      images: dto.carouselImageUrls && dto.carouselImageUrls.length ? dto.carouselImageUrls : undefined,
      longDescription: dto.description,
    };
  };
}
