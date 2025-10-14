export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface CartDto {
  id: number;
  userId: number;
  items: CartItemDto[];
  totalPrice: number;
}

export interface AddItemToCartRequestDto {
  userId: number;
  productId: number;
  quantity: number; // >=1
}

export interface UpdateItemQuantityDto {
  quantity: number; // >=1
}

