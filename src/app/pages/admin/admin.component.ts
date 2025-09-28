import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { StockService } from '../../services/stock.service';
import { MOCK_PRODUCTS } from '../../data/mock-products';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  orders = inject(OrderService);
  stock = inject(StockService);

  products = MOCK_PRODUCTS;
  // For editing stock inline
  editing = signal<Record<number, number>>({});

  constructor() {
    // Ensure stock defaults exist (only touches missing products)
    this.stock.ensureInitialized();
  }

  setEdit(id: number, val: any) {
    const n = Math.max(0, Math.floor(Number(val) || 0));
    this.editing.set({ ...this.editing(), [id]: n });
  }
  saveStock(id: number) {
    const val = this.editing()[id];
    if (typeof val === 'number' && !Number.isNaN(val)) {
      this.stock.set(id, val);
    }
  }
  clearEdit(id: number) {
    const map = { ...this.editing() };
    delete map[id];
    this.editing.set(map);
  }

  onImgError(e: Event) {
    const el = e.target as HTMLImageElement | null;
    if (el && el.src.indexOf('assets/placeholder-product.svg') === -1) {
      el.src = 'assets/placeholder-product.svg';
    }
  }
}
