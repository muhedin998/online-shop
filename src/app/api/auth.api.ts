import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginRequestDto, LoginResponseDto, MessageResponseDto, RegisterRequestDto } from './models/auth.dto';
import { Observable } from 'rxjs';
import { UserDto } from './models/user.dto';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private base = `${environment.apiBaseUrl}/auth`;
  constructor(private http: HttpClient) {}

  login(body: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.base}/login`, body);
  }

  register(body: RegisterRequestDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.base}/register`, body);
  }

  forgotPassword(email: string): Observable<MessageResponseDto> {
    return this.http.post<MessageResponseDto>(`${this.base}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<MessageResponseDto> {
    return this.http.post<MessageResponseDto>(`${this.base}/reset-password`, { token, newPassword });
  }
}

