import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AddItemToCartRequestDto, CartDto, UpdateItemQuantityDto } from './models/cart.dto';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private base = `${environment.apiBaseUrl}/cart`;
  constructor(private http: HttpClient) {}

  get(userId: number): Observable<CartDto> {
    return this.http.get<CartDto>(`${this.base}/${userId}`);
  }

  add(body: AddItemToCartRequestDto): Observable<CartDto> {
    return this.http.post<CartDto>(`${this.base}/add`, body);
  }

  updateQuantity(userId: number, itemId: number, body: UpdateItemQuantityDto): Observable<CartDto> {
    return this.http.put<CartDto>(`${this.base}/${userId}/update-quantity/${itemId}`, body);
  }

  removeItem(userId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/delete/${userId}/items/${itemId}`);
  }
}

