import { categories } from '../../data/mocks/categories';
import { menuItems } from '../../data/mocks/menuItems';
import { restaurants } from '../../data/mocks/restaurants';
import type { Catalog, OrderDraft, OrderReceipt } from '../../models';
import { ServiceError, type Services } from './contracts';

function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', abort, { once: true });
  });
}
export function createMockServices(
  config: {
    latency?: number;
    scenario?: 'normal' | 'empty' | 'error';
    orderError?: boolean;
  } = {},
): Services {
  const catalog: Catalog = { categories, menuItems, restaurants };
  return {
    catalog: {
      async getCatalog(signal) {
        await delay(config.latency ?? 250, signal);
        if (config.scenario === 'error')
          throw new ServiceError(
            'We couldn’t load the menu. Please try again.',
            'unavailable',
          );
        return structuredClone(
          config.scenario === 'empty'
            ? { categories, restaurants: [], menuItems: [] }
            : catalog,
        );
      },
    },
    orders: {
      async submit(draft: OrderDraft, signal): Promise<OrderReceipt> {
        await delay(config.latency ?? 450, signal);
        if (config.orderError)
          throw new ServiceError(
            'Your demo order could not be created. Please try again.',
            'unavailable',
          );
        if (
          !draft.groups.length ||
          !draft.guest.name.trim() ||
          !draft.guest.phone.trim() ||
          (draft.fulfillment === 'delivery' && !draft.guest.address.trim())
        )
          throw new ServiceError(
            'Please complete your order details.',
            'validation',
          );
        const id = crypto.randomUUID().slice(0, 8).toUpperCase();
        const orders = draft.groups.map((group, index) => ({
          id: `${id}-${index + 1}`,
          restaurantId: group.restaurant.id,
          restaurantName: group.restaurant.name,
          items: structuredClone(group.items),
          subtotal: group.subtotal,
          deliveryFee: group.deliveryFee,
          total: group.total,
          status: 'demo-confirmed' as const,
        }));
        return {
          id,
          orders,
          fulfillment: draft.fulfillment,
          createdAt: new Date().toISOString(),
          total: orders.reduce((sum, order) => sum + order.total, 0),
        };
      },
    },
    auth: {
      async getCurrentUser() {
        return null;
      },
      async login() {
        throw new ServiceError(
          'Sign-in will be available when an authentication service is connected.',
          'unsupported',
        );
      },
      async logout() {},
    },
  };
}
