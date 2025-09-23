import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable()
export class CartService {
  private readonly STORAGE_KEY = 'barber_cart_v1';
  private itemsSig = signal<CartItem[]>(this.load());

  items = computed(() => this.itemsSig());
  totalItems = computed(() => this.itemsSig().reduce((sum, i) => sum + i.quantity, 0));
  totalPrice = computed(() => this.itemsSig().reduce((sum, i) => sum + i.quantity * i.product.price, 0));

  add(product: Product, qty = 1) {
    const items = [...this.itemsSig()];
    const idx = items.findIndex(i => i.product.id === product.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + qty };
    } else {
      items.push({ product, quantity: qty });
    }
    this.itemsSig.set(items);
    this.persist();
  }

  remove(productId: number) {
    const items = this.itemsSig().filter(i => i.product.id !== productId);
    this.itemsSig.set(items);
    this.persist();
  }

  setQuantity(productId: number, qty: number) {
    if (qty <= 0) return this.remove(productId);
    const items = this.itemsSig().map(i => i.product.id === productId ? { ...i, quantity: qty } : i);
    this.itemsSig.set(items);
    this.persist();
  }

  clear() {
    this.itemsSig.set([]);
    this.persist();
  }

  private persist() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.itemsSig()));
    } catch {}
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

