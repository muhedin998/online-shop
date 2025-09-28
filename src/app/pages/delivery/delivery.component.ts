import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css'],
})
export class DeliveryComponent {
  cart = inject(CartService);
  private orders = inject(OrderService);
  private auth = inject(AuthService);
  private stock = inject(StockService);

  placeOrder() {
    const user = this.auth.user();
    const items = this.cart.items();
    if (!items.length) { alert('Korpa je prazna.'); return; }
    const order = this.orders.createOrder({ items, method: 'cod', user: user || undefined });
    for (const it of items) this.stock.adjust(it.product.id, -it.quantity);
    this.cart.clear();
    alert(`Porudžbina potvrđena! (#${order.id.slice(0,8)})`);
  }
}
