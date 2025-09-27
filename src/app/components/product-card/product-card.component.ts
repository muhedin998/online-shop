import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() isFavorite = false;
  @Output() add = new EventEmitter<Product>();
  @Output() toggleFavorite = new EventEmitter<number>();
  @Output() view = new EventEmitter<Product>();

  onImgError(e: Event) {
    const el = e.target as HTMLImageElement;
    if (el && el.src.indexOf('assets/placeholder-product.svg') === -1) {
      el.src = 'assets/placeholder-product.svg';
    }
  }
}
