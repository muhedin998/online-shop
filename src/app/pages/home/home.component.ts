import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// FormsModule no longer required here (used in review form)
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product';
import { MOCK_PRODUCTS } from '../../data/mock-products';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { SearchService } from '../../services/search.service';
import { ReviewFormComponent } from '../../components/review-form/review-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ReviewFormComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private cart = inject(CartService);
  private favs = inject(FavoritesService);
  search = inject(SearchService);

  products = MOCK_PRODUCTS;
  selectedFilter = signal<string>('Sve');
  filtered = computed(() => {
    const q = this.search.query().trim().toLowerCase();
    if (!q) return this.products;
    return this.products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description?.toLowerCase().includes(q)) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  });
  visible = computed(() => this.filtered().filter(p => this.matchesFilter(p)));
  selected: Product | null = null;
  gallery: string[] = [];
  currentIndex = 0;
  // simple swipe state
  private startX = 0;
  private startY = 0;
  deltaX = 0;
  dragging = false;

  addToCart(p: Product) {
    this.cart.add(p, 1);
  }

  isFav(id: number) { return this.favs.isFavorite(id); }
  toggleFav(id: number) { this.favs.toggle(id); }

  openDetail(p: Product) {
    this.selected = p;
    this.gallery = (p.images && p.images.length ? p.images : [p.imageUrl]);
    this.currentIndex = 0;
  }
  closeDetail() {
    this.selected = null;
    this.dragging = false;
  }

  prev() {
    if (!this.gallery.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.gallery.length) % this.gallery.length;
  }
  next() {
    if (!this.gallery.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.gallery.length;
  }
  go(i: number) {
    this.currentIndex = i;
  }

  onPointerDown(ev: PointerEvent) {
    this.dragging = true;
    this.startX = ev.clientX;
    this.startY = ev.clientY;
    this.deltaX = 0;
  }
  onPointerMove(ev: PointerEvent) {
    if (!this.dragging) return;
    const dx = ev.clientX - this.startX;
    const dy = ev.clientY - this.startY;
    // Cancel swipe if vertical scroll is dominant
    if (Math.abs(dy) > Math.abs(dx) * 1.2) return;
    this.deltaX = dx;
  }
  onPointerUp(ev: PointerEvent) {
    if (!this.dragging) return;
    this.dragging = false;
    const threshold = 50; // px
    if (this.deltaX > threshold) this.prev();
    else if (this.deltaX < -threshold) this.next();
    this.deltaX = 0;
  }

  onImgError(e: Event) {
    const el = e.target as HTMLImageElement;
    if (el && el.src.indexOf('assets/placeholder-product.svg') === -1) {
      el.src = 'assets/placeholder-product.svg';
    }
  }

  // Simple category filter logic
  matchesFilter(p: Product): boolean {
    const f = this.selectedFilter();
    if (f === 'Sve') return true;
    const name = p.name.toLowerCase();
    const tags = (p.tags || []).map(t => t.toLowerCase());
    switch (f) {
      case 'Ulja':
        return name.includes('ulje') || tags.includes('biljno') || tags.includes('lagano');
      case 'Balzami':
        return name.includes('balzam');
      case 'Posle brijanja':
        return name.includes('posle brijanja') || tags.includes('posle brijanja');
      case 'Pre brijanja':
        return name.includes('pre brijanja') || tags.includes('pre-brijanje');
      case 'Šamponi':
        return name.includes('šampon');
      case 'Pasta':
        return name.includes('pasta');
      case 'Alat':
        return name.includes('četka') || name.includes('brijač');
      default:
        return true;
    }
  }

  onReviewSubmitted() {}
}
