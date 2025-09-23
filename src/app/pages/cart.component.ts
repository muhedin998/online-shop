import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cart = inject(CartService);

  dec(id: number, qty: number) { this.cart.setQuantity(id, qty - 1); }
  inc(id: number, qty: number) { this.cart.setQuantity(id, qty + 1); }
  onQtyChange(id: number, val: any) {
    const n = Math.max(0, Number(val) || 0);
    this.cart.setQuantity(id, n);
  }

  onImgError(e: Event) {
    const el = e.target as HTMLImageElement;
    if (el && el.src.indexOf('assets/placeholder-product.svg') === -1) {
      el.src = 'assets/placeholder-product.svg';
    }
  }
}
