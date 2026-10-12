import { describe, expect, it } from 'vitest';
import { categories } from '../../data/mocks/categories';
import { menuItems } from '../../data/mocks/menuItems';
import { restaurants } from '../../data/mocks/restaurants';
import {
  cartReducer,
  groupCart,
  makeCartItem,
  readStoredCart,
  reconcileCart,
  validOptions,
} from './cartLogic';
const catalog = { categories, menuItems, restaurants };
const burger = menuItems.find((item) => item.id === 'burger')!;
const cake = menuItems.find((item) => item.id === 'cake')!;
describe('multi-restaurant cart', () => {
  it('preserves and prices combined extras, merging equivalent selection order', () => {
    const first = makeCartItem(burger, 1, ['cheese', 'patty']);
    const reversed = makeCartItem(burger, 1, ['patty', 'cheese']);
    const cart = cartReducer(
      { items: [first] },
      { type: 'add', item: reversed },
    );
    expect(cart.items).toHaveLength(1);
    const restored = reconcileCart(
      readStoredCart(JSON.stringify({ version: 1, items: cart.items })),
      catalog,
    );
    const group = groupCart(restored, catalog, 'delivery')[0];
    expect(group.items[0].options.map((option) => option.id)).toEqual([
      'cheese',
      'patty',
    ]);
    expect(group.items[0].unitPrice).toBe(3390);
    expect(group.total).toBe(7280);
  });
  it('requires at least one choice in required multiple groups and rejects duplicate or unknown options', () => {
    const requiredExtras = {
      ...burger,
      optionGroups: burger.optionGroups.map((group) => ({
        ...group,
        required: true,
      })),
    };
    expect(validOptions(requiredExtras, [])).toBe(false);
    expect(validOptions(requiredExtras, ['cheese'])).toBe(true);
    expect(validOptions(requiredExtras, ['cheese', 'patty'])).toBe(true);
    expect(validOptions(requiredExtras, ['cheese', 'cheese'])).toBe(false);
    expect(validOptions(requiredExtras, ['cheese', 'invented'])).toBe(false);
    expect(validOptions(burger, [])).toBe(true);
  });
  it('normalises persisted keys so restored selections remain editable and removable', () => {
    const entry = makeCartItem(burger, 1, ['cheese']);
    const cart = readStoredCart(
      JSON.stringify({
        version: 1,
        items: [
          { ...entry, key: 'stale-key' },
          { ...entry, key: 'another-stale-key' },
        ],
      }),
    );
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(2);
    expect(cartReducer(cart, { type: 'remove', key: entry.key }).items).toEqual(
      [],
    );
  });
  it('merges identical configurations and keeps different options separate', () => {
    let cart = cartReducer(
      { items: [] },
      { type: 'add', item: makeCartItem(burger, 2, ['cheese']) },
    );
    cart = cartReducer(cart, {
      type: 'add',
      item: makeCartItem(burger, 3, ['cheese']),
    });
    cart = cartReducer(cart, {
      type: 'add',
      item: makeCartItem(burger, 1, ['patty']),
    });
    expect(cart.items.map((item) => item.quantity)).toEqual([5, 1]);
    const groups = groupCart(cart, catalog, 'delivery');
    expect(groups[0].subtotal).toBe(5 * 2740 + 3140);
    expect(groups[0].total).toBe(groups[0].subtotal + 500);
  });
  it('groups restaurant subtotals and delivery fees independently', () => {
    const cart = {
      items: [makeCartItem(burger, 2, []), makeCartItem(cake, 1, [])],
    };
    const groups = groupCart(cart, catalog, 'delivery');
    expect(
      groups.map((group) => [
        group.restaurant.id,
        group.subtotal,
        group.deliveryFee,
        group.total,
      ]),
    ).toEqual([
      ['bun', 4980, 500, 5480],
      ['green', 1290, 350, 1640],
    ]);
    expect(
      groupCart(cart, catalog, 'pickup').map((group) => group.deliveryFee),
    ).toEqual([0, 0]);
  });
  it('removes only the selected restaurant, or one selected item', () => {
    const cart = {
      items: [makeCartItem(burger, 1, []), makeCartItem(cake, 1, [])],
    };
    expect(
      cartReducer(cart, { type: 'remove-restaurant', restaurantId: 'bun' })
        .items,
    ).toEqual([makeCartItem(cake, 1, [])]);
    expect(
      cartReducer(cart, { type: 'remove', key: cart.items[1].key }).items,
    ).toEqual([makeCartItem(burger, 1, [])]);
  });
  it('updates options and merges edited configurations without duplication', () => {
    const cart = {
      items: [makeCartItem(burger, 1, []), makeCartItem(burger, 2, ['cheese'])],
    };
    const edited = cartReducer(cart, {
      type: 'replace',
      key: cart.items[0].key,
      item: makeCartItem(burger, 3, ['cheese']),
    });
    expect(edited.items).toHaveLength(1);
    expect(edited.items[0].quantity).toBe(5);
  });
  it('enforces quantity and selection constraints', () => {
    const cart = { items: [makeCartItem(burger, 19, [])] };
    expect(
      cartReducer(cart, { type: 'add', item: makeCartItem(burger, 3, []) })
        .items[0].quantity,
    ).toBe(20);
    expect(
      cartReducer(cart, {
        type: 'quantity',
        key: cart.items[0].key,
        quantity: 0,
      }),
    ).toEqual(cart);
    expect(() => makeCartItem(burger, 1.5, [])).toThrow();
    expect(validOptions(burger, ['cheese', 'patty'])).toBe(true);
    expect(validOptions(menuItems[0], ['mild', 'hot'])).toBe(false);
    expect(validOptions(menuItems[0], [])).toBe(false);
    expect(validOptions(menuItems[0], ['mild', 'mild'])).toBe(false);
  });
  it('rejects corrupt storage and reconciles unknown, unavailable or invalid entries', () => {
    expect(readStoredCart('{broken')).toEqual({ items: [] });
    expect(readStoredCart(JSON.stringify({ version: 2, items: [] }))).toEqual({
      items: [],
    });
    const stored = readStoredCart(
      JSON.stringify({
        version: 1,
        items: [
          makeCartItem(burger, 1, []),
          { ...makeCartItem(cake, 1, []), menuItemId: 'missing' },
          { ...makeCartItem(burger, 1, []), optionIds: ['invented'] },
          { quantity: -1 },
        ],
      }),
    );
    expect(reconcileCart(stored, catalog).items).toEqual([
      makeCartItem(burger, 1, []),
    ]);
  });
  it('recalculates from the current catalog instead of trusting stored prices', () => {
    const cart = { items: [makeCartItem(burger, 1, [])] };
    const updatedCatalog = {
      ...catalog,
      menuItems: menuItems.map((item) =>
        item.id === burger.id ? { ...item, price: 3000 } : item,
      ),
    };
    expect(groupCart(cart, updatedCatalog, 'pickup')[0].subtotal).toBe(3000);
  });
});
