import { Injectable, computed, signal } from '@angular/core';
import { Order } from '../models/order';
import { CartItem } from './cart.service';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly STORAGE_KEY = 'barber_orders_v1';
  private ordersSig = signal<Order[]>(this.load());

  orders = computed(() => this.ordersSig());
  pending = computed(() => this.ordersSig().filter(o => !o.shipped));
  paid = computed(() => this.ordersSig().filter(o => o.paid));
  unpaid = computed(() => this.ordersSig().filter(o => !o.paid));

  createOrder(params: { items: CartItem[]; method: 'now' | 'cod'; user?: User | null }): Order {
    const { items, method, user } = params;
    const order: Order = {
      id: crypto.randomUUID(),
      items: items.map(i => ({ product: i.product, quantity: i.quantity })),
      total: items.reduce((s, i) => s + i.quantity * i.product.price, 0),
      paymentMethod: method,
      paid: method === 'now',
      shipped: false,
      createdAt: new Date().toISOString(),
      user: user ? { id: user.id, firstName: user.firstName, email: user.email, phone: user.phone } : undefined,
    };
    const next = [order, ...this.ordersSig()];
    this.ordersSig.set(next);
    this.persist();
    return order;
  }

  markPaid(id: string, paid: boolean) {
    const next = this.ordersSig().map(o => (o.id === id ? { ...o, paid } : o));
    this.ordersSig.set(next);
    this.persist();
  }

  markShipped(id: string, shipped: boolean) {
    const next = this.ordersSig().map(o => (o.id === id ? { ...o, shipped } : o));
    this.ordersSig.set(next);
    this.persist();
  }

  private persist() {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.ordersSig())); } catch {}
  }
  private load(): Order[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) as Order[] : [];
    } catch {
      return [];
    }
  }
}

