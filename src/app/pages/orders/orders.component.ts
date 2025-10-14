import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrdersApiService } from '../../api/orders.api';
import { OrderDto } from '../../api/models/order.dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent {
  private ordersApi = inject(OrdersApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal<boolean>(false);
  error = signal<string>('');
  orders = signal<OrderDto[]>([]);

  constructor() {
    const uid = this.auth.user()?.backendId;
    if (uid == null) {
      this.router.navigate(['/profil'], { queryParams: { redirect: 'orders' } });
      return;
    }
    this.fetch(uid);
  }

  fetch(userId: number) {
    this.loading.set(true);
    this.error.set('');
    this.ordersApi.listByUser(userId).subscribe({
      next: (list) => {
        this.orders.set(list || []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Greška pri učitavanju porudžbina.');
        this.loading.set(false);
      },
    });
  }
}

