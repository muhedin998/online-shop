export interface ProductCategoryDto {
  id: number;
  name: string;
  description?: string;
}

export interface ProductDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  featured: boolean;
  mainImageUrl?: string;
  carouselImageUrls?: string[];
  category?: ProductCategoryDto | null;
}

export interface CreateProductRequestDto {
  name: string;
  description?: string;
  price: number; // > 0
  stockQuantity: number; // >=0
  featured: boolean;
  categoryId?: number | null;
}

export interface UpdateProductRequestDto {
  name?: string;
  description?: string;
  price?: number; // > 0
  stockQuantity?: number; // >=0
  featured?: boolean;
  categoryId?: number | null;
}

// Generic Spring Page
export interface Page<T> {
  content: T[];
  number: number; // current page index (0-based)
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
