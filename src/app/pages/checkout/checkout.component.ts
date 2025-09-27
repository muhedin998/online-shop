import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    alert(`Porudžbina potvrđena! Hvala, ${user?.name || 'kupče'}!`);
    this.cart.clear();
  }
}
