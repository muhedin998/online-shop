import { Injectable, computed, signal } from '@angular/core';
import { MOCK_PRODUCTS } from '../data/mock-products';

type StockMap = Record<number, number>; // productId -> quantity

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly STORAGE_KEY = 'barber_stock_v1';
  private stockSig = signal<StockMap>(this.load());

  stock = computed(() => this.stockSig());

  get(productId: number): number {
    return this.stockSig()[productId] ?? 0;
  }

  set(productId: number, qty: number) {
    const next = { ...this.stockSig(), [productId]: Math.max(0, Math.floor(qty)) };
    this.stockSig.set(next);
    this.persist();
  }

  adjust(productId: number, delta: number) {
    const curr = this.get(productId);
    this.set(productId, curr + delta);
  }

  ensureInitialized(defaultQty = 50) {
    // Initialize any missing product stock values
    const map = { ...this.stockSig() };
    let changed = false;
    for (const p of MOCK_PRODUCTS) {
      if (map[p.id] == null) {
        map[p.id] = defaultQty;
        changed = true;
      }
    }
    if (changed) {
      this.stockSig.set(map);
      this.persist();
    }
  }

  private persist() {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.stockSig())); } catch {}
  }
  private load(): StockMap {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StockMap) : {};
    } catch {
      return {} as StockMap;
    }
  }
}

