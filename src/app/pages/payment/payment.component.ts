import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

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

  continuePayment() {
    alert('Preusmeravanje na provajdera plaćanja (' + this.method() + ') – demo');
  }
}
