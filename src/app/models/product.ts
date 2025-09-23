export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // in your currency
  imageUrl: string;
  rating?: number; // 0-5
  volume?: string; // e.g., "50ml"
  tags?: string[];
  // Optional extended details for modal view
  images?: string[]; // additional images for gallery/swiper
  longDescription?: string; // longer rich description
}
