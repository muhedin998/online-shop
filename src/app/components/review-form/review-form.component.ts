import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent {
  @Input() productId?: number | null;
  @Output() submitted = new EventEmitter<void>();

  open = signal(false);
  rating = signal<number>(0);
  comment = '';
  done = signal(false);

  toggle() {
    this.open.set(!this.open());
  }

  setRating(v: number) {
    this.rating.set(v);
  }

  submit() {
    if (!this.productId) return;
    const payload = {
      id: this.productId,
      rating: this.rating(),
      comment: this.comment?.trim() || '',
      ts: Date.now()
    };
    try {
      const key = 'reviews_v1';
      const raw = localStorage.getItem(key);
      const data = raw ? JSON.parse(raw) : {};
      data[this.productId] = data[this.productId] || [];
      data[this.productId].push(payload);
      localStorage.setItem(key, JSON.stringify(data));
    } catch {}
    this.done.set(true);
    this.submitted.emit();
    setTimeout(() => this.done.set(false), 3000);
    this.open.set(false);
    this.rating.set(0);
    this.comment = '';
  }
}

