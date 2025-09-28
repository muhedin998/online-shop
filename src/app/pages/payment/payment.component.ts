import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  cart = inject(CartService);
  method = signal<'card' | 'apple' | 'bank'>('card');
  private orders = inject(OrderService);
  private auth = inject(AuthService);
  private stock = inject(StockService);

  continuePayment() {
    const user = this.auth.user();
    const items = this.cart.items();
    if (!items.length) { alert('Korpa je prazna.'); return; }
    const order = this.orders.createOrder({ items, method: 'now', user: user || undefined });
    for (const it of items) this.stock.adjust(it.product.id, -it.quantity);
    this.cart.clear();
    alert('Plaćanje uspešno – porudžbina #'+ order.id.slice(0,8));
  }
}
