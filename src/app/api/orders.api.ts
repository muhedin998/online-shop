import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CreateOrderRequestDto, OrderDto, UpdateOrderStatusRequestDto } from './models/order.dto';

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private base = `${environment.apiBaseUrl}/orders`;
  constructor(private http: HttpClient) {}

  get(orderId: number): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.base}/${orderId}`);
  }

  listByUser(userId: number): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.base}/user/${userId}`);
  }

  create(userId: number, body: CreateOrderRequestDto): Observable<OrderDto> {
    return this.http.post<OrderDto>(`${this.base}/create/${userId}`, body);
  }

  cancel(orderId: number): Observable<void> {
    return this.http.post<void>(`${this.base}/cancel/${orderId}`, {});
  }

  updateStatusAdmin(orderId: number, body: UpdateOrderStatusRequestDto): Observable<OrderDto> {
    return this.http.put<OrderDto>(`${this.base}/admin/${orderId}/status`, body);
  }
}

