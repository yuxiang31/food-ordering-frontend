import { useEffect, useMemo, useReducer, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { Fulfillment, MenuItem } from '../../models';
import { useCatalog } from '../catalog/catalogContext';
import { CartContext } from './cartContext';
import {
  cartReducer,
  groupCart,
  makeCartItem,
  readStoredCart,
  reconcileCart,
  CART_STORAGE_KEY,
} from './cartLogic';
function initialCart() {
  try {
    return readStoredCart(localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    return { items: [] };
  }
}
export function CartProvider({ children }: PropsWithChildren) {
  const [storedCart, dispatch] = useReducer(
    cartReducer,
    undefined,
    initialCart,
  );
  const [fulfillment, setFulfillment] = useState<Fulfillment>('delivery');
  const [message, setMessage] = useState('');
  const { data } = useCatalog();
  const cart = useMemo(
    () => (data ? reconcileCart(storedCart, data) : storedCart),
    [storedCart, data],
  );
  const groups = useMemo(
    () => (data ? groupCart(cart, data, fulfillment) : []),
    [cart, data, fulfillment],
  );
  useEffect(() => {
    if (!data) return;
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ version: 1, items: cart.items }),
      );
    } catch {
      /* Cart remains usable when browser storage is unavailable. */
    }
  }, [cart, data]);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 4500);
    return () => clearTimeout(timer);
  }, [message]);
  const add = (
    item: MenuItem,
    quantity: number,
    options: string[],
    editKey?: string,
  ) => {
    const entry = makeCartItem(item, quantity, options);
    dispatch(
      editKey
        ? { type: 'replace', key: editKey, item: entry }
        : { type: 'add', item: entry },
    );
    setMessage(
      `${item.name} ${editKey ? 'updated in' : 'added to'} your cart. Up to 20 of each selection.`,
    );
  };
  const quantity = (key: string, value: number) => {
    dispatch({ type: 'quantity', key, quantity: value });
    setMessage(
      `Quantity updated to ${value}. Your total has been recalculated.`,
    );
  };
  const remove = (key: string) => {
    dispatch({ type: 'remove', key });
    setMessage('Item removed from your cart.');
  };
  const removeRestaurant = (id: string) => {
    dispatch({ type: 'remove-restaurant', restaurantId: id });
    setMessage('Restaurant order removed. Your other orders are unchanged.');
  };
  return (
    <CartContext
      value={{
        cart,
        groups,
        fulfillment,
        setFulfillment,
        count: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        total: groups.reduce((sum, group) => sum + group.total, 0),
        add,
        quantity,
        remove,
        removeRestaurant,
        clear: () => dispatch({ type: 'clear' }),
        message,
      }}
    >
      {children}
    </CartContext>
  );
}
