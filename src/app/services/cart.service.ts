import { Injectable, computed, signal, inject } from '@angular/core';
import { Product } from '../models/product';
import { CartApiService } from '../api/cart.api';
import { ProductsApiService } from '../api/products.api';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable()
export class CartService {
  private readonly STORAGE_KEY = 'barber_cart_v1';
  private itemsSig = signal<CartItem[]>(this.load());
  private itemIdByProductId: Record<number, number> = {};

  private cartApi = inject(CartApiService);
  private productsApi = inject(ProductsApiService);
  private auth = inject(AuthService);

  items = computed(() => this.itemsSig());
  totalItems = computed(() => this.itemsSig().reduce((sum, i) => sum + i.quantity, 0));
  totalPrice = computed(() => this.itemsSig().reduce((sum, i) => sum + i.quantity * i.product.price, 0));

  constructor() {
    this.refreshFromBackend().catch(() => {});
  }

  async add(product: Product, qty = 1) {
    const uid = this.auth.user()?.backendId;
    if (uid != null) {
      try {
        await firstValueFrom(this.cartApi.add({ userId: uid, productId: product.id, quantity: qty }));
        await this.refreshFromBackend();
        return;
      } catch {
        // fall through to local update
      }
    }
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

  async remove(productId: number) {
    const uid = this.auth.user()?.backendId;
    if (uid != null) {
      const itemId = this.itemIdByProductId[productId];
      try {
        if (itemId == null) await this.refreshFromBackend();
        const id = this.itemIdByProductId[productId];
        if (id != null) {
          await firstValueFrom(this.cartApi.removeItem(uid, id));
          await this.refreshFromBackend();
          return;
        }
      } catch {
        // fall back
      }
    }
    const items = this.itemsSig().filter(i => i.product.id !== productId);
    this.itemsSig.set(items);
    this.persist();
  }

  async setQuantity(productId: number, qty: number) {
    if (qty <= 0) return this.remove(productId);
    const uid = this.auth.user()?.backendId;
    if (uid != null) {
      try {
        let itemId = this.itemIdByProductId[productId];
        if (itemId == null) await this.refreshFromBackend();
        itemId = this.itemIdByProductId[productId];
        if (itemId != null) {
          await firstValueFrom(this.cartApi.updateQuantity(uid, itemId, { quantity: qty }));
          await this.refreshFromBackend();
          return;
        }
      } catch {
        // fall back
      }
    }
    const items = this.itemsSig().map(i => i.product.id === productId ? { ...i, quantity: qty } : i);
    this.itemsSig.set(items);
    this.persist();
  }

  async clear() {
    const uid = this.auth.user()?.backendId;
    if (uid != null) {
      await this.refreshFromBackend();
      const pids = Object.keys(this.itemIdByProductId).map(n => Number(n));
      for (const pid of pids) {
        const id = this.itemIdByProductId[pid];
        try { await firstValueFrom(this.cartApi.removeItem(uid, id)); } catch {}
      }
      await this.refreshFromBackend();
      return;
    }
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

  private async refreshFromBackend() {
    const uid = this.auth.user()?.backendId;
    if (uid == null) return;
    try {
      const cart = await firstValueFrom(this.cartApi.get(uid));
      // map productId -> itemId
      const map: Record<number, number> = {};
      const promises = cart.items.map(async (ci) => {
        map[ci.productId] = ci.id;
        try {
          const pd = await firstValueFrom(this.productsApi.getById(ci.productId));
          const product: Product = {
            id: pd.id,
            name: pd.name,
            description: pd.description || '',
            price: pd.price,
            imageUrl: pd.mainImageUrl || 'assets/placeholder-product.svg',
          } as Product;
          return { product, quantity: ci.quantity } as CartItem;
        } catch {
          // minimal product info if product fetch fails
          const product: Product = { id: ci.productId, name: ci.productName, description: '', price: ci.price, imageUrl: 'assets/placeholder-product.svg' } as Product;
          return { product, quantity: ci.quantity } as CartItem;
        }
      });
      const items = await Promise.all(promises);
      this.itemIdByProductId = map;
      this.itemsSig.set(items);
      this.persist();
    } catch {
      // ignore if backend unavailable
    }
  }
}

