import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private q = signal<string>('');
  query = computed(() => this.q());

  setQuery(val: string) { this.q.set(val); }
  clear() { this.q.set(''); }
}

