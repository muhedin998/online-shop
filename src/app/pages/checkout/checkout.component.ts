import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  cart = inject(CartService);
  method = signal<'now' | 'cod'>('now');
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private orders = inject(OrderService);
  private stock = inject(StockService);

  constructor() {
    const m = (this.route.snapshot.queryParamMap.get('method') || '').toLowerCase();
    if (m === 'cod' || m === 'now') this.method.set(m as 'now' | 'cod');
  }

  placeOrder() {
    if (!this.auth.isLoggedIn()) {
      alert('Prijavite se kako biste potvrdili porudžbinu.');
      this.router.navigate(['/profil'], { queryParams: { redirect: 'checkout' } });
      return;
    }
    const user = this.auth.user();
    const items = this.cart.items();
    if (!items.length) {
      alert('Korpa je prazna.');
      return;
    }
    // Create order and adjust stock
    const order = this.orders.createOrder({ items, method: this.method(), user: user || undefined });
    for (const it of items) {
      this.stock.adjust(it.product.id, -it.quantity);
    }
    this.cart.clear();
    alert(`Porudžbina potvrđena! Hvala, ${user?.firstName || 'kupče'}! (#${order.id.slice(0,8)})`);
  }
}
