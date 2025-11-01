import { CartItem } from '../services/cart.service';
import { User } from './user';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'now' | 'cod';
  paid: boolean;
  shipped: boolean;
  createdAt: string; // ISO string
  user?: Pick<User, 'id' | 'firstName' | 'email' | 'phone'>;
}

