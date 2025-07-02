import { CartItem } from './cart-item.interface';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed';
  createdAt: string;
  paymentMethod: 'cash' | 'khqr';
  customerName: string;
}

export interface OrderSummary {
  id: string;
  customerName: string;
  total: number;
  status: 'pending' | 'completed';
  itemCount: number;
  createdAt: string;
} 