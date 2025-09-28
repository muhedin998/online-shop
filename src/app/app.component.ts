import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from './services/cart.service';
import { FavoritesService } from './services/favorites.service';
import { SearchService } from './services/search.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [CartService, FavoritesService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private router = inject(Router);
  private cart = inject(CartService);
  private favs = inject(FavoritesService);
  search = inject(SearchService);
  auth = inject(AuthService);

  searchOpen = signal(false);
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  cartCount = computed(() => this.cart.totalItems());
  favCount = computed(() => this.favs.count());

  onHomeClick(ev: Event) {
    if (this.router.url === '/' || this.router.url === '') {
      ev.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleSearch() {
    this.searchOpen.set(!this.searchOpen());
    // Focus behavior could be added via a small timeout and ViewChild.
    if (this.searchOpen()) {
      setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
    }
  }
  onSearch(ev: Event) {
    const val = (ev.target as HTMLInputElement)?.value ?? '';
    this.search.setQuery(val);
  }
  closeSearch() {
    this.searchOpen.set(false);
    this.search.clear();
  }
}
