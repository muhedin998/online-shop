export type OrderStatus =
  | 'PENDING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELED'
  | 'RETURNED'
  | 'REFUNDED'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'AWAITING_PAYMENT';

export interface OrderItemDto {
  productId: number;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderDto {
  id: number;
  orderDate: string; // ISO
  status: OrderStatus;
  totalPrice: number;
  items: OrderItemDto[];
  trackingNumber?: string;
}

export interface UpdateOrderStatusRequestDto {
  status: OrderStatus;
}

export interface CreateOrderRequestDto {
  addressId?: number;
  shippingAddress?: AddressDto; // imported via inline duplication to avoid circular dep
}

// Lightweight duplicate of AddressDto fields to avoid import cycle in this file
export interface AddressDto {
  id?: number;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  countryCode: string;
  phone?: string;
  label?: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

