import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrdersApiService } from '../../api/orders.api';
import { OrderDto } from '../../api/models/order.dto';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent {
  private ordersApi = inject(OrdersApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal<boolean>(true);
  error = signal<string>('');
  order = signal<OrderDto | null>(null);

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!id || Number.isNaN(id)) {
      this.error.set('Neispravan ID porudžbine.');
      this.loading.set(false);
      return;
    }
    this.fetch(id);
  }

  fetch(id: number) {
    this.loading.set(true);
    this.error.set('');
    this.ordersApi.get(id).subscribe({
      next: (o) => { this.order.set(o); this.loading.set(false); },
      error: () => { this.error.set('Greška pri učitavanju porudžbine.'); this.loading.set(false); },
    });
  }

  cancel() {
    const id = this.order()?.id;
    if (!id) return;
    this.ordersApi.cancel(id).subscribe({
      next: () => { this.fetch(id); },
      error: () => { alert('Greška pri otkazivanju porudžbine.'); },
    });
  }
}

