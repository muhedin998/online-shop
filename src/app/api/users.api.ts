import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UserDto, UserRolesDto } from './models/user.dto';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private base = `${environment.apiBaseUrl}/users`;
  constructor(private http: HttpClient) {}

  getByUsername(username: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.base}/${encodeURIComponent(username)}`);
  }

  getRoles(username: string): Observable<UserRolesDto> {
    return this.http.get<UserRolesDto>(`${this.base}/${encodeURIComponent(username)}/roles`);
  }
}

