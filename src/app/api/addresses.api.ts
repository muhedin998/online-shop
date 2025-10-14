import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AddressDto } from './models/address.dto';

@Injectable({ providedIn: 'root' })
export class AddressesApiService {
  private base = `${environment.apiBaseUrl}/addresses`;
  constructor(private http: HttpClient) {}

  list(userId: number): Observable<AddressDto[]> {
    return this.http.get<AddressDto[]>(`${this.base}/${userId}`);
  }

  create(userId: number, body: AddressDto): Observable<AddressDto> {
    return this.http.post<AddressDto>(`${this.base}/${userId}`, body);
  }
}

