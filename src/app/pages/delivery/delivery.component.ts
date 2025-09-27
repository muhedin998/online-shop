import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css'],
})
export class DeliveryComponent {
  cart = inject(CartService);

  placeOrder() {
    alert('Porudžbina potvrđena! (demonstracija)');
    this.cart.clear();
  }
}
