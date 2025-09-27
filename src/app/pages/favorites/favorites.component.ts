import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { MOCK_PRODUCTS } from '../../data/mock-products';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent {
  private favs = inject(FavoritesService);
  private cart = inject(CartService);

  favProducts = computed(() => MOCK_PRODUCTS.filter(p => this.favs.list().includes(p.id)));

  toggle(id: number) { this.favs.toggle(id); }
  addToCart(p: any) { this.cart.add(p, 1); }
}
