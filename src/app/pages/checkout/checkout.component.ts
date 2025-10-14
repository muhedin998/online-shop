import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AddressesApiService } from '../../api/addresses.api';
import { OrdersApiService } from '../../api/orders.api';
import { AddressDto } from '../../api/models/address.dto';
import { FormsModule } from '@angular/forms';
import { getFieldErrors, getGeneralMessage } from '../../utils/api-error';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  cart = inject(CartService);
  method = signal<'now' | 'cod'>('now');
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private addressesApi = inject(AddressesApiService);
  private ordersApi = inject(OrdersApiService);

  // Address state (backend)
  addresses = signal<AddressDto[]>([]);
  selectedAddressId = signal<number | null>(null);
  useNewAddress = signal<boolean>(false);

  newAddress = signal<AddressDto>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    countryCode: 'RS',
    phone: '',
    label: 'Home',
    isDefaultShipping: true,
    isDefaultBilling: false,
  });

  requiredValid = computed(() => {
    const a = this.newAddress();
    return !!(a.fullName && a.addressLine1 && a.city && a.postalCode && a.countryCode);
  });
  addrErrors = signal<Record<string, string>>({});
  generalError = signal('');

  onUseNewToggle(checked: boolean) {
    this.useNewAddress.set(checked);
    if (checked) this.selectedAddressId.set(null);
  }

  updateNew(field: keyof AddressDto, value: any) {
    const curr = this.newAddress();
    this.newAddress.set({ ...curr, [field]: value } as AddressDto);
  }

  constructor() {
    const m = (this.route.snapshot.queryParamMap.get('method') || '').toLowerCase();
    if (m === 'cod' || m === 'now') this.method.set(m as 'now' | 'cod');
    // Load user addresses if logged in against backend
    const uid = this.auth.user()?.backendId;
    if (uid != null) {
      this.addressesApi.list(uid).subscribe({
        next: (list) => this.addresses.set(list || []),
        error: () => {},
      });
    }
  }

  async placeOrder() {
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
    const uid = user?.backendId;
    if (uid != null) {
      // Backend-driven order creation
      try {
        let body: any = {};
        if (!this.useNewAddress() && this.selectedAddressId()) {
          body = { addressId: this.selectedAddressId()! };
        } else {
          if (!this.requiredValid()) {
            alert('Molimo popunite obavezna polja za adresu: Ime i prezime, Adresa, Grad, Poštanski broj, Država.');
            return;
          }
          body = { shippingAddress: this.newAddress() };
        }
        const order = await this.ordersApi.create(uid, body).toPromise();
        await this.cart.clear();
        alert(`Porudžbina potvrđena! Hvala, ${user?.name || 'kupče'}! (ID: ${order?.id ?? '?'})`);
        return;
      } catch (e) {
        // Map backend validation errors to fields if present
        this.addrErrors.set(getFieldErrors(e));
        this.generalError.set(getGeneralMessage(e, 'Došlo je do greške pri kreiranju porudžbine.'));
        return;
      }
    }
    // Fallback to local order flow when not connected to backend
    alert('Backend nije dostupan ili niste prijavljeni na backend. Kreira se lokalna porudžbina.');
    // Keep existing behavior minimal on fallback
    // Clear just local cart and show confirmation
    await this.cart.clear();
    alert(`Porudžbina potvrđena (lokalno)! Hvala, ${user?.name || 'kupče'}!`);
  }
}
