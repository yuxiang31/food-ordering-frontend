import { describe, expect, it } from 'vitest';
import { createMockServices } from './mock';
import { groupCart, makeCartItem } from '../../features/cart/cartLogic';
describe('repository boundaries', () => {
  it('returns isolated data and supports empty/error scenarios', async () => {
    const services = createMockServices({ latency: 0 });
    const data = await services.catalog.getCatalog();
    data.restaurants[0].name = 'Changed';
    expect((await services.catalog.getCatalog()).restaurants[0].name).toBe(
      'Dapur & Co.',
    );
    expect(
      (
        await createMockServices({
          latency: 0,
          scenario: 'empty',
        }).catalog.getCatalog()
      ).menuItems,
    ).toEqual([]);
    await expect(
      createMockServices({
        latency: 0,
        scenario: 'error',
      }).catalog.getCatalog(),
    ).rejects.toThrow('couldn’t load');
  });
  it('cancels repository work', async () => {
    const controller = new AbortController();
    const request = createMockServices({ latency: 100 }).catalog.getCatalog(
      controller.signal,
    );
    controller.abort();
    await expect(request).rejects.toMatchObject({ name: 'AbortError' });
  });
  it('creates separate restaurant orders in one receipt without persisting personal details', async () => {
    const services = createMockServices({ latency: 0 });
    const catalog = await services.catalog.getCatalog();
    const cart = {
      items: [
        makeCartItem(catalog.menuItems[1], 1, []),
        makeCartItem(catalog.menuItems[5], 2, []),
      ],
    };
    const receipt = await services.orders.submit({
      groups: groupCart(cart, catalog, 'pickup'),
      fulfillment: 'pickup',
      guest: {
        name: 'Demo Guest',
        phone: '0123456789',
        address: '',
        notes: '',
      },
    });
    expect(receipt.orders.map((order) => order.restaurantId)).toEqual([
      'bun',
      'green',
    ]);
    expect(new Set(receipt.orders.map((order) => order.id)).size).toBe(2);
    expect(receipt.total).toBe(2490 + 2580);
    expect(receipt).not.toHaveProperty('guest');
    expect(receipt.orders.every((order) => order.deliveryFee === 0)).toBe(true);
  });
  it('keeps current authentication explicitly guest-only', async () => {
    const auth = createMockServices().auth;
    expect(await auth.getCurrentUser()).toBeNull();
    await expect(auth.login()).rejects.toMatchObject({ code: 'unsupported' });
  });
});
