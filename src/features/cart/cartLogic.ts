import type {
  Cart,
  CartGroup,
  CartItem,
  Catalog,
  Fulfillment,
  MenuItem,
} from '../../models';
export const MAX_QUANTITY = 20;
export const CART_STORAGE_KEY = 'savour.cart.v1';
export const cartKey = (id: string, options: string[]) =>
  `${id}:${[...options].sort().join(',')}`;
export function validOptions(item: MenuItem, ids: string[]) {
  const known = item.optionGroups.flatMap((group) =>
    group.options.map((option) => option.id),
  );
  return (
    new Set(ids).size === ids.length &&
    ids.every((id) => known.includes(id)) &&
    item.optionGroups.every((group) => {
      const selected = group.options.filter((option) =>
        ids.includes(option.id),
      ).length;
      if (group.required && selected === 0) return false;
      return group.selection === 'multiple' || selected <= 1;
    })
  );
}
export function makeCartItem(
  item: MenuItem,
  quantity: number,
  optionIds: string[],
): CartItem {
  if (
    !item.available ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_QUANTITY ||
    !validOptions(item, optionIds)
  )
    throw new Error('Choose valid options and a quantity between 1 and 20.');
  return {
    key: cartKey(item.id, optionIds),
    menuItemId: item.id,
    restaurantId: item.restaurantId,
    quantity,
    optionIds: [...optionIds].sort(),
  };
}
export type CartAction =
  | { type: 'add'; item: CartItem }
  | { type: 'replace'; key: string; item: CartItem }
  | { type: 'quantity'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'remove-restaurant'; restaurantId: string }
  | { type: 'clear' };
export function cartReducer(cart: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'add': {
      const existing = cart.items.find((item) => item.key === action.item.key);
      return {
        items: existing
          ? cart.items.map((item) =>
              item.key === existing.key
                ? {
                    ...item,
                    quantity: Math.min(
                      MAX_QUANTITY,
                      item.quantity + action.item.quantity,
                    ),
                  }
                : item,
            )
          : [...cart.items, action.item],
      };
    }
    case 'replace':
      return cartReducer(
        { items: cart.items.filter((item) => item.key !== action.key) },
        { type: 'add', item: action.item },
      );
    case 'quantity':
      return Number.isInteger(action.quantity) &&
        action.quantity >= 1 &&
        action.quantity <= MAX_QUANTITY
        ? {
            items: cart.items.map((item) =>
              item.key === action.key
                ? { ...item, quantity: action.quantity }
                : item,
            ),
          }
        : cart;
    case 'remove':
      return { items: cart.items.filter((item) => item.key !== action.key) };
    case 'remove-restaurant':
      return {
        items: cart.items.filter(
          (item) => item.restaurantId !== action.restaurantId,
        ),
      };
    case 'clear':
      return { items: [] };
  }
}
export function readStoredCart(raw: string | null): Cart {
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (
      !value ||
      typeof value !== 'object' ||
      !('version' in value) ||
      value.version !== 1 ||
      !('items' in value) ||
      !Array.isArray(value.items)
    )
      return { items: [] };
    const items = value.items.filter((item): item is CartItem => {
      if (!item || typeof item !== 'object') return false;
      return (
        typeof item.key === 'string' &&
        typeof item.menuItemId === 'string' &&
        typeof item.restaurantId === 'string' &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= MAX_QUANTITY &&
        Array.isArray(item.optionIds) &&
        item.optionIds.every((id: unknown) => typeof id === 'string')
      );
    });
    return items.slice(0, 100).reduce<Cart>(
      (cart, item) =>
        cartReducer(cart, {
          type: 'add',
          item: {
            key: cartKey(item.menuItemId, item.optionIds),
            menuItemId: item.menuItemId,
            restaurantId: item.restaurantId,
            quantity: item.quantity,
            optionIds: [...item.optionIds].sort(),
          },
        }),
      { items: [] },
    );
  } catch {
    return { items: [] };
  }
}
export function reconcileCart(cart: Cart, catalog: Catalog): Cart {
  return cart.items.reduce<Cart>(
    (clean, entry) => {
      const item = catalog.menuItems.find(
        (item) =>
          item.id === entry.menuItemId &&
          item.restaurantId === entry.restaurantId &&
          item.available,
      );
      if (
        !item ||
        !catalog.restaurants.some(
          (restaurant) => restaurant.id === entry.restaurantId,
        ) ||
        !validOptions(item, entry.optionIds)
      )
        return clean;
      return cartReducer(clean, {
        type: 'add',
        item: makeCartItem(item, entry.quantity, entry.optionIds),
      });
    },
    { items: [] },
  );
}
export function groupCart(
  cart: Cart,
  catalog: Catalog,
  fulfillment: Fulfillment,
): CartGroup[] {
  const clean = reconcileCart(cart, catalog);
  return catalog.restaurants.flatMap((restaurant) => {
    const items = clean.items
      .filter((entry) => entry.restaurantId === restaurant.id)
      .map((entry) => {
        const menuItem = catalog.menuItems.find(
          (item) => item.id === entry.menuItemId,
        )!;
        const options = menuItem.optionGroups
          .flatMap((group) => group.options)
          .filter((option) => entry.optionIds.includes(option.id));
        const unitPrice =
          menuItem.price +
          options.reduce((sum, option) => sum + option.price, 0);
        return {
          ...entry,
          menuItem,
          options,
          unitPrice,
          lineTotal: unitPrice * entry.quantity,
        };
      });
    if (!items.length) return [];
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const deliveryFee = fulfillment === 'delivery' ? restaurant.deliveryFee : 0;
    return [
      {
        restaurant,
        items,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
      },
    ];
  });
}
