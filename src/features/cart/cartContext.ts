import { createContext, useContext } from 'react';
import type { Cart, CartGroup, Fulfillment, MenuItem } from '../../models';
type CartContextValue = {
  cart: Cart;
  groups: CartGroup[];
  fulfillment: Fulfillment;
  setFulfillment: (value: Fulfillment) => void;
  count: number;
  total: number;
  message: string;
  add: (
    item: MenuItem,
    quantity: number,
    options: string[],
    editKey?: string,
  ) => void;
  quantity: (key: string, value: number) => void;
  remove: (key: string) => void;
  removeRestaurant: (id: string) => void;
  clear: () => void;
};
export const CartContext = createContext<CartContextValue | null>(null);
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('CartProvider is required');
  return value;
}
