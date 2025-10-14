import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { AuthApiService } from '../api/auth.api';
import { UsersApiService } from '../api/users.api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'barber_user_v1';
  private readonly TOKEN_KEY = 'auth.token';
  private readonly USERNAME_KEY = 'auth.username';
  private u = signal<User | null>(this.load());

  user = computed(() => this.u());
  isLoggedIn = computed(() => !!this.u());
  // Simple admin detection: name 'ADMIN' or email 'admin@admin.com'
  isAdmin = computed(() => {
    const u = this.u();
    if (!u) return false;
    const name = (u.name || '').trim().toLowerCase();
    const email = (u.email || '').trim().toLowerCase();
    return name === 'admin' || email === 'admin@admin.com';
  });

  constructor(private http: HttpClient, private authApi: AuthApiService, private usersApi: UsersApiService) {}

  // Backend login using username + password
  async loginBackend(username: string, password: string): Promise<{ ok: boolean; error?: any }> {
    try {
      const res = await this.authApi.login({ username, password }).toPromise();
      const token = res?.token;
      if (token) {
        try { localStorage.setItem(this.TOKEN_KEY, token); } catch {}
        try { localStorage.setItem(this.USERNAME_KEY, username); } catch {}
        // Fetch profile to hydrate local user
        const profile = await this.usersApi.getByUsername(username).toPromise();
        if (profile) {
          const user: User = {
            id: String(profile.id),
            backendId: profile.id,
            name: profile.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : profile.username,
            email: profile.email,
          };
          this.setUser(user);
        }
        // Prefetch roles for guards
        try {
          const rolesRes = await this.usersApi.getRoles(username).toPromise();
          const roles = rolesRes?.roles || [];
          try { localStorage.setItem('auth.roles', JSON.stringify(roles)); } catch {}
        } catch {}
        return { ok: true };
      }
      return { ok: false };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  // Legacy local login kept as fallback
  login(email: string, _password: string) {
    const existing = this.load();
    if (existing && existing.email.toLowerCase() === email.toLowerCase()) {
      this.setUser(existing);
      return true;
    }
    const name = email.split('@')[0];
    const user: User = { id: crypto.randomUUID(), name, email };
    this.setUser(user);
    return true;
  }

  async register(data: { username: string; email: string; password: string; firstName?: string; lastName?: string }): Promise<{ ok: boolean; error?: any }> {
    // Try backend register first, fallback to local if it fails
    try {
      await this.authApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      }).toPromise();
      // Backend does not log in automatically; leave token unset
      const user: User = { id: crypto.randomUUID(), name: data.username, email: data.email };
      this.setUser(user);
      return { ok: true };
    } catch (e) {
      const user: User = { id: crypto.randomUUID(), name: data.username, email: data.email };
      this.setUser(user);
      return { ok: false, error: e };
    }
  }

  logout() {
    this.u.set(null);
    try { localStorage.removeItem(this.STORAGE_KEY); } catch {}
    try { localStorage.removeItem(this.TOKEN_KEY); } catch {}
    try { localStorage.removeItem(this.USERNAME_KEY); } catch {}
  }

  private setUser(user: User) {
    this.u.set(user);
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user)); } catch {}
  }

  private load(): User | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) as User : null;
    } catch {
      return null;
    }
  }
}
