import {Injectable, computed, signal, inject} from '@angular/core';
import { User } from '../models/user';
import { UserRegisterDtoModel } from '../models/dtos/user-register-dto.model';
import {HttpClient} from "@angular/common/http";
import {catchError, map, shareReplay, tap} from "rxjs";
import {LoginDtoModel} from "../models/dtos/login-dto.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY_USER = 'barber_user_v1';
  private readonly STORAGE_KEY_TOKEN = 'barber_token_v1';
  private readonly BASE_URL = '/api/v1/auth'
  private u = signal<User | null>(this.loadUser());
  private http = inject(HttpClient)
  user = computed(() => this.u());
  isLoggedIn = computed(() => !!this.u());
  // Simple admin detection: name 'ADMIN' or email 'admin@admin.com'
  isAdmin = computed(() => {
    const u = this.u();
    if (!u) return false;
    const name = (u.firstName || '').trim().toLowerCase();
    const email = (u.email || '').trim().toLowerCase();
    return name === 'admin' || email === 'admin@admin.com';
  });

  login(credentials: LoginDtoModel) {
    return this.http
      .post<{ user: User; token: string }>(this.BASE_URL + '/login', credentials)
      .pipe(
        tap(({ user, token }) => this.setSession(user, token)),
        map(({ user }) => user),
        catchError(error => {
          console.error('Login failed:', error);
          throw error;
        }),
        shareReplay(1)
      );
  }

  register(data: UserRegisterDtoModel) {
    return this.http
      .post<{ user: User; token: string }>(this.BASE_URL + '/register', data)
      .pipe(
        tap(({ user, token }) => this.setSession(user, token)),
        map(({ user }) => user),
        catchError(error => {
          console.error('Registration failed:', error);
          throw error;
        }),
        shareReplay(1)
      );
  }

  logout() {
    this.u.set(null);
    try {
      localStorage.removeItem(this.STORAGE_KEY_USER);
      localStorage.removeItem(this.STORAGE_KEY_TOKEN);
    } catch {}
  }

  private setSession(user: User, token: string) {
    this.u.set(user);
    try {
      localStorage.setItem(this.STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(this.STORAGE_KEY_TOKEN, token);
    } catch {}
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_USER);
      return raw ? JSON.parse(raw) as User : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(this.STORAGE_KEY_TOKEN);
    } catch {
      return null;
    }
  }
}
