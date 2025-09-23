import { Injectable, computed, signal } from '@angular/core';

@Injectable()
export class FavoritesService {
  private readonly STORAGE_KEY = 'barber_favs_v1';
  private ids = signal<number[]>(this.load());

  list = computed(() => this.ids());
  count = computed(() => this.ids().length);

  isFavorite = (id: number) => this.ids().includes(id);

  toggle(id: number) {
    const set = new Set(this.ids());
    set.has(id) ? set.delete(id) : set.add(id);
    const arr = Array.from(set);
    this.ids.set(arr);
    this.persist();
  }

  remove(id: number) {
    this.ids.set(this.ids().filter(i => i !== id));
    this.persist();
  }

  private persist() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.ids()));
    } catch {}
  }

  private load(): number[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

