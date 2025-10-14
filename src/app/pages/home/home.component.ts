import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// FormsModule no longer required here (used in review form)
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { SearchService } from '../../services/search.service';
import { ReviewFormComponent } from '../../components/review-form/review-form.component';
import { ProductsService } from '../../services/products.service';
import { CategoriesApiService } from '../../api/categories.api';
import { Page, ProductCategoryDto, ProductDto } from '../../api/models/product.dto';
import { ProductsApiService } from '../../api/products.api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, ReviewFormComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private cart = inject(CartService);
  private favs = inject(FavoritesService);
  search = inject(SearchService);
  // Keep existing service for other consumers, but use API directly for paging
  private productsSvc = inject(ProductsService);
  private productsApi = inject(ProductsApiService);
  private categoriesApi = inject(CategoriesApiService);

  products = signal<Product[]>([]);
  categories = signal<ProductCategoryDto[]>([]);
  selectedCategoryId = signal<number | null>(null);
  pageIndex = signal<number>(0);
  pageSize = signal<number>(12);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  loading = signal<boolean>(false);
  // Filters per backend reference
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  inStock = signal<boolean | null>(null);
  featured = signal<boolean | null>(null);
  sortKey = signal<'name' | 'price' | 'id'>('name');
  sortDir = signal<'asc' | 'desc'>('asc');
  visible = computed(() => this.products());
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

  constructor() {
    // Load categories
    this.categoriesApi.list().subscribe({ next: (cats) => this.categories.set(cats || []), error: () => {} });
    // React to search, category selection, page, and size to call backend search
    effect(() => {
      const q = this.search.query().trim();
      const cat = this.selectedCategoryId();
      const page = this.pageIndex();
      const size = this.pageSize();
      const minPrice = this.minPrice();
      const maxPrice = this.maxPrice();
      const inStock = this.inStock();
      const featured = this.featured();
      const sort = `${this.sortKey()},${this.sortDir()}`;
      this.loading.set(true);
      this.productsApi.search({
        searchText: q || undefined,
        categoryId: cat || undefined,
        minPrice: minPrice == null ? undefined : minPrice,
        maxPrice: maxPrice == null ? undefined : maxPrice,
        inStock: inStock == null ? undefined : inStock,
        featured: featured == null ? undefined : featured,
        sort,
        page,
        size,
      }).subscribe({
        next: (pg: Page<ProductDto>) => {
          const content = Array.isArray(pg?.content) ? pg.content : [];
          this.products.set(content.map(this.mapDtoToProduct));
          this.totalPages.set(pg?.totalPages || 0);
          this.totalElements.set(pg?.totalElements || 0);
          this.loading.set(false);
        },
        error: () => { this.loading.set(false); },
      });
    });
  }

  // Map backend ProductDto to UI Product
  private mapDtoToProduct = (dto: ProductDto): Product => ({
    id: dto.id,
    name: dto.name,
    description: dto.description || '',
    price: dto.price,
    imageUrl: dto.mainImageUrl || 'assets/placeholder-product.svg',
    tags: dto.featured ? ['featured'] : [],
    images: dto.carouselImageUrls && dto.carouselImageUrls.length ? dto.carouselImageUrls : undefined,
    longDescription: dto.description,
  });

  prevPage() { if (this.pageIndex() > 0) this.pageIndex.set(this.pageIndex() - 1); }
  nextPage() { if (this.pageIndex() + 1 < this.totalPages()) this.pageIndex.set(this.pageIndex() + 1); }
  goPage(i: number) { if (i >= 0 && i < this.totalPages()) this.pageIndex.set(i); }
  setSize(n: number) { this.pageSize.set(n); this.pageIndex.set(0); }

  firstPage() { if (this.pageIndex() !== 0) this.pageIndex.set(0); }
  lastPage() { const tp = this.totalPages(); if (tp > 0) this.pageIndex.set(tp - 1); }
  jumpTo(pageOneBased: number) {
    const p = Math.max(1, Math.min(pageOneBased, this.totalPages() || 1));
    this.goPage(p - 1);
  }

  // Change any filter should reset to first page
  setMinPrice(v: any) { const n = Number(v); this.minPrice.set(Number.isFinite(n) ? n : null); this.firstPage(); }
  setMaxPrice(v: any) { const n = Number(v); this.maxPrice.set(Number.isFinite(n) ? n : null); this.firstPage(); }
  setInStock(v: boolean) { this.inStock.set(v); this.firstPage(); }
  clearInStock() { this.inStock.set(null); this.firstPage(); }
  setFeatured(v: boolean) { this.featured.set(v); this.firstPage(); }
  clearFeatured() { this.featured.set(null); this.firstPage(); }
  setSortKey(k: 'name' | 'price' | 'id') { this.sortKey.set(k); this.firstPage(); }
  setSortDir(d: 'asc' | 'desc') { this.sortDir.set(d); this.firstPage(); }

  onReviewSubmitted() {}
}
