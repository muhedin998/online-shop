import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

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

  constructor() {
    const m = (this.route.snapshot.queryParamMap.get('method') || '').toLowerCase();
    if (m === 'cod' || m === 'now') this.method.set(m as 'now' | 'cod');
  }

  placeOrder() {
    alert('Porudžbina potvrđena! (demonstracija)');
    this.cart.clear();
  }
}
