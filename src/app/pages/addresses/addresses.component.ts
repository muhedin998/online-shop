import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AddressesApiService } from '../../api/addresses.api';
import { AddressDto } from '../../api/models/address.dto';
import { AuthService } from '../../services/auth.service';
import { getFieldErrors, getGeneralMessage } from '../../utils/api-error';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css'],
})
export class AddressesComponent {
  private addressesApi = inject(AddressesApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  addresses = signal<AddressDto[]>([]);
  loading = signal<boolean>(false);
  error = signal<string>('');

  // New address form state
  a = signal<AddressDto>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    countryCode: 'RS',
    phone: '',
    label: 'Home',
    isDefaultShipping: false,
    isDefaultBilling: false,
  });

  valid = computed(() => {
    const v = this.a();
    return !!(v.fullName && v.addressLine1 && v.city && v.postalCode && v.countryCode);
  });
  fieldErrors = signal<Record<string, string>>({});
  generalError = signal('');

  constructor() {
    const uid = this.auth.user()?.backendId;
    if (uid == null) {
      this.router.navigate(['/profil'], { queryParams: { redirect: 'addresses' } });
      return;
    }
    this.refresh(uid);
  }

  refresh(uid: number) {
    this.loading.set(true);
    this.error.set('');
    this.addressesApi.list(uid).subscribe({
      next: (list) => { this.addresses.set(list || []); this.loading.set(false); },
      error: () => { this.error.set('Greška pri učitavanju adresa.'); this.loading.set(false); },
    });
  }

  update(field: keyof AddressDto, value: any) {
    const curr = this.a();
    this.a.set({ ...curr, [field]: value } as AddressDto);
  }

  add() {
    const uid = this.auth.user()?.backendId;
    if (uid == null) return;
    if (!this.valid()) { alert('Popunite obavezna polja za adresu.'); return; }
    this.fieldErrors.set({}); this.generalError.set('');
    this.addressesApi.create(uid, this.a()).subscribe({
      next: (addr) => {
        this.addresses.set([addr, ...this.addresses()]);
        // reset form
        this.a.set({ fullName: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', countryCode: 'RS', phone: '', label: 'Home', isDefaultShipping: false, isDefaultBilling: false });
      },
      error: (e) => { this.fieldErrors.set(getFieldErrors(e)); this.generalError.set(getGeneralMessage(e, 'Greška pri čuvanju adrese.')); },
    });
  }
}
