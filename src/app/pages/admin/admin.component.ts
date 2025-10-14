import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { StockService } from '../../services/stock.service';
import { ProductsApiService } from '../../api/products.api';
import { CategoriesApiService } from '../../api/categories.api';
import { ProductCategoryDto, ProductDto } from '../../api/models/product.dto';
import { OrdersApiService } from '../../api/orders.api';
import { OrderDto, OrderStatus } from '../../api/models/order.dto';
import { getFieldErrors, getGeneralMessage } from '../../utils/api-error';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  orders = inject(OrderService);
  stock = inject(StockService);

  private productsApi = inject(ProductsApiService);
  private categoriesApi = inject(CategoriesApiService);
  private ordersApi = inject(OrdersApiService);

  products = signal<ProductDto[]>([]);
  categories = signal<ProductCategoryDto[]>([]);
  // For editing stock inline
  editing = signal<Record<number, number>>({});

  // Create product form state
  create = signal<{ name: string; description?: string; price: number; stockQuantity: number; featured: boolean; categoryId?: number | null }>({
    name: '', description: '', price: 0, stockQuantity: 0, featured: false, categoryId: null
  });
  createErrs = signal<Record<string, string>>({});
  createError = signal('');

  // Inline product edit state
  editProd = signal<Record<number, Partial<{ name: string; description: string; price: number; stockQuantity: number; featured: boolean; categoryId: number | null }>>>({});
  editProdFieldErrors = signal<Record<number, Record<string, string>>>({});
  editProdGeneralError = signal<Record<number, string>>({});

  // Categories CRUD state
  newCat = signal<{ name: string; description?: string }>({ name: '', description: '' });
  editCat = signal<Record<number, { name: string; description?: string }>>({});
  editCatFieldErrors = signal<Record<number, Record<string, string>>>({});
  editCatGeneralError = signal<Record<number, string>>({});

  // Order status update state
  updOrderId = signal<number | null>(null);
  updStatus = signal<OrderStatus>('PENDING');

  // Admin orders by user
  ordersUserId = signal<number | null>(null);
  ordersLoading = signal<boolean>(false);
  ordersError = signal<string>('');
  ordersByUser = signal<OrderDto[]>([]);

  constructor() {
    this.stock.ensureInitialized();
    this.refresh();
    this.categoriesApi.list().subscribe({ next: (cats) => this.categories.set(cats || []), error: () => {} });
  }

  setEdit(id: number, val: any) {
    const n = Math.max(0, Math.floor(Number(val) || 0));
    this.editing.set({ ...this.editing(), [id]: n });
  }
  saveStock(id: number) {
    const val = this.editing()[id];
    if (typeof val === 'number' && !Number.isNaN(val)) {
      this.stock.set(id, val);
    }
  }
  clearEdit(id: number) {
    const map = { ...this.editing() };
    delete map[id];
    this.editing.set(map);
  }

  onImgError(e: Event) {
    const el = e.target as HTMLImageElement | null;
    if (el && el.src.indexOf('assets/placeholder-product.svg') === -1) {
      el.src = 'assets/placeholder-product.svg';
    }
  }

  refresh() {
    // Load non-featured paged list first page.
    this.productsApi.list(0, 50).subscribe({
      next: (page) => this.products.set(page?.content || []),
      error: () => this.products.set([]),
    });
  }

  setCreate<K extends keyof ReturnType<typeof this.create> & string>(key: K, value: any) {
    const curr = this.create();
    (curr as any)[key] = value;
    this.create.set({ ...curr });
  }

  doCreate() {
    const c = this.create();
    if (!c.name || !c.price || c.stockQuantity == null) { alert('Popunite obavezna polja: naziv, cena, količina.'); return; }
    this.createErrs.set({}); this.createError.set('');
    this.productsApi.create({
      name: c.name,
      description: c.description,
      price: Number(c.price),
      stockQuantity: Number(c.stockQuantity),
      featured: !!c.featured,
      categoryId: c.categoryId ?? null,
    }).subscribe({
      next: () => { this.refresh(); this.create.set({ name: '', description: '', price: 0, stockQuantity: 0, featured: false, categoryId: null }); },
      error: (e) => { this.createErrs.set(getFieldErrors(e)); this.createError.set(getGeneralMessage(e, 'Greška pri kreiranju proizvoda.')); },
    });
  }

  del(id: number) {
    if (!confirm('Obrisati proizvod?')) return;
    this.productsApi.delete(id).subscribe({ next: () => this.refresh(), error: () => alert('Greška pri brisanju.')} );
  }

  // Product inline edit helpers
  startEdit(id: number) {
    const p = this.products().find(x => x.id === id);
    if (!p) return;
    const curr = { name: p.name, description: p.description, price: p.price, stockQuantity: p.stockQuantity, featured: p.featured, categoryId: p.category?.id ?? null };
    this.editProd.set({ ...this.editProd(), [id]: curr });
    const pe = { ...this.editProdFieldErrors() }; delete pe[id]; this.editProdFieldErrors.set(pe);
    const pg = { ...this.editProdGeneralError() }; delete pg[id]; this.editProdGeneralError.set(pg);
  }
  setEditField(id: number, key: keyof ReturnType<typeof this.editProd> extends never ? never : 'name' | 'description' | 'price' | 'stockQuantity' | 'featured' | 'categoryId', value: any) {
    const map = { ...this.editProd() };
    const curr = map[id] || {};
    (curr as any)[key] = value;
    map[id] = curr;
    this.editProd.set(map);
  }
  cancelEdit(id: number) {
    const map = { ...this.editProd() };
    delete map[id];
    this.editProd.set(map);
    const pe = { ...this.editProdFieldErrors() }; delete pe[id]; this.editProdFieldErrors.set(pe);
    const pg = { ...this.editProdGeneralError() }; delete pg[id]; this.editProdGeneralError.set(pg);
  }
  saveEdit(id: number) {
    const curr = this.editProd()[id];
    if (!curr) return;
    // clear errors for this id
    const pe0 = { ...this.editProdFieldErrors() }; delete pe0[id]; this.editProdFieldErrors.set(pe0);
    const pg0 = { ...this.editProdGeneralError() }; delete pg0[id]; this.editProdGeneralError.set(pg0);
    const body: any = {};
    for (const k of ['name','description','price','stockQuantity','featured','categoryId'] as const) {
      if ((curr as any)[k] !== undefined) body[k] = (curr as any)[k];
    }
    this.productsApi.update(id, body).subscribe({
      next: () => { this.refresh(); this.cancelEdit(id); },
      error: (e) => {
        const errs = getFieldErrors(e);
        const gen = getGeneralMessage(e, 'Greška pri ažuriranju proizvoda.');
        const pe = { ...this.editProdFieldErrors() }; pe[id] = errs || {}; this.editProdFieldErrors.set(pe);
        const pg = { ...this.editProdGeneralError() }; pg[id] = gen; this.editProdGeneralError.set(pg);
      },
    });
  }

  // Categories CRUD
  setNewCat(field: keyof ReturnType<typeof this.newCat>, value: any) {
    const c = this.newCat();
    (c as any)[field] = value;
    this.newCat.set({ ...c });
  }
  createCat() {
    const c = this.newCat();
    if (!c.name) { alert('Unesite naziv kategorije.'); return; }
    this.categoriesApi.create({ name: c.name, description: c.description }).subscribe({
      next: (saved) => { this.categories.set([saved, ...(this.categories() || [])]); this.newCat.set({ name: '', description: '' }); },
      error: () => alert('Greška pri kreiranju kategorije.'),
    });
  }
  startCatEdit(id: number) {
    const c = this.categories().find(x => x.id === id);
    if (!c) return;
    this.editCat.set({ ...this.editCat(), [id]: { name: c.name, description: c.description } });
    const ce = { ...this.editCatFieldErrors() }; delete ce[id]; this.editCatFieldErrors.set(ce);
    const cg = { ...this.editCatGeneralError() }; delete cg[id]; this.editCatGeneralError.set(cg);
  }
  setCatEditField(id: number, field: keyof { name: string; description?: string }, value: any) {
    const map = { ...this.editCat() };
    const curr = map[id] || { name: '', description: '' };
    (curr as any)[field] = value;
    map[id] = curr;
    this.editCat.set(map);
  }
  cancelCatEdit(id: number) {
    const map = { ...this.editCat() };
    delete map[id];
    this.editCat.set(map);
    const ce = { ...this.editCatFieldErrors() }; delete ce[id]; this.editCatFieldErrors.set(ce);
    const cg = { ...this.editCatGeneralError() }; delete cg[id]; this.editCatGeneralError.set(cg);
  }
  saveCatEdit(id: number) {
    const curr = this.editCat()[id];
    if (!curr || !curr.name) { alert('Naziv je obavezan.'); return; }
    // clear errors for this id
    const ce0 = { ...this.editCatFieldErrors() }; delete ce0[id]; this.editCatFieldErrors.set(ce0);
    const cg0 = { ...this.editCatGeneralError() }; delete cg0[id]; this.editCatGeneralError.set(cg0);
    this.categoriesApi.update(id, { name: curr.name, description: curr.description }).subscribe({
      next: (updated) => {
        const list = (this.categories() || []).map(c => c.id === id ? updated : c);
        this.categories.set(list);
        this.cancelCatEdit(id);
      },
      error: (e) => {
        const errs = getFieldErrors(e);
        const gen = getGeneralMessage(e, 'Greška pri ažuriranju kategorije.');
        const ce = { ...this.editCatFieldErrors() }; ce[id] = errs || {}; this.editCatFieldErrors.set(ce);
        const cg = { ...this.editCatGeneralError() }; cg[id] = gen; this.editCatGeneralError.set(cg);
      },
    });
  }
  deleteCat(id: number) {
    if (!confirm('Obrisati kategoriju?')) return;
    this.categoriesApi.delete(id).subscribe({
      next: () => this.categories.set((this.categories() || []).filter(c => c.id !== id)),
      error: () => alert('Greška pri brisanju kategorije.'),
    });
  }

  updateOrderStatus() {
    const id = this.updOrderId();
    const st = this.updStatus();
    if (!id) { alert('Unesite ID porudžbine.'); return; }
    this.ordersApi.updateStatusAdmin(id, { status: st }).subscribe({
      next: () => alert('Status porudžbine ažuriran.'),
      error: () => alert('Greška pri ažuriranju statusa.'),
    });
  }

  loadOrdersByUser() {
    const uid = this.ordersUserId();
    if (!uid) { alert('Unesite korisnički ID.'); return; }
    this.ordersLoading.set(true);
    this.ordersError.set('');
    this.ordersApi.listByUser(uid).subscribe({
      next: (list) => { this.ordersByUser.set(list || []); this.ordersLoading.set(false); },
      error: () => { this.ordersError.set('Greška pri učitavanju porudžbina.'); this.ordersLoading.set(false); },
    });
  }
}
