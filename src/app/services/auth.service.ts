import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'barber_user_v1';
  private u = signal<User | null>(this.load());

  user = computed(() => this.u());
  isLoggedIn = computed(() => !!this.u());

  login(email: string, _password: string) {
    const existing = this.load();
    if (existing && existing.email.toLowerCase() === email.toLowerCase()) {
      this.setUser(existing);
      return true;
    }
    // Demo-only: create a minimal user on first login if not registered
    const name = email.split('@')[0];
    const user: User = { id: crypto.randomUUID(), name, email };
    this.setUser(user);
    return true;
  }

  register(data: { name: string; email: string; password: string; phone?: string }) {
    const user: User = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
    this.setUser(user);
    return true;
  }

  logout() {
    this.u.set(null);
    try { localStorage.removeItem(this.STORAGE_KEY); } catch {}
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

