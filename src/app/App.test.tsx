import { describe, expect, it } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { App } from './App';
import { createMockServices } from '../services/repositories/mock';
import { CART_STORAGE_KEY } from '../features/cart/cartLogic';
function mount(path = '/', services = createMockServices({ latency: 0 })) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App services={services} />
    </MemoryRouter>,
  );
}
describe('ordering experience', () => {
  it('provides a clear page heading and recovery link for missing food', async () => {
    mount('/food/missing');
    expect(
      await screen.findByRole('heading', {
        name: 'This dish isn’t on the menu',
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Discover food' })).toHaveAttribute(
      'href',
      '/',
    );
  });
  it('keeps editing the same cart line when options change more than once', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        items: [
          {
            key: 'burger:',
            menuItemId: 'burger',
            restaurantId: 'bun',
            quantity: 1,
            optionIds: [],
          },
        ],
      }),
    );
    mount('/food/burger?edit=burger%3A');
    await screen.findByRole('heading', { name: 'The Classic Smash' });
    await user.click(screen.getByRole('radio', { name: /Extra cheese/ }));
    await user.click(screen.getByRole('button', { name: /Update item/ }));
    expect(
      screen.getByRole('button', { name: /Saved to cart/ }),
    ).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: /Extra beef patty/ }));
    await user.click(screen.getByRole('button', { name: /Update item/ }));
    await user.click(screen.getByRole('link', { name: 'Review your cart →' }));
    const group = await screen.findByRole('region', { name: 'The Good Bun' });
    expect(within(group).getByText('Extra beef patty')).toBeInTheDocument();
    expect(within(group).getByText('RM 36.40')).toBeInTheDocument();
    expect(within(group).queryByText('Extra cheese')).not.toBeInTheDocument();
  });
  it('searches by restaurant, filters categories and recovers from no results', async () => {
    const user = userEvent.setup();
    mount();
    await screen.findByRole('link', { name: 'Choose The Classic Smash' });
    await user.type(
      screen.getByRole('textbox', { name: 'Search food or restaurants' }),
      'Green Table',
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(
      screen.queryByRole('link', { name: 'Choose The Classic Smash' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Choose The Sunshine Bowl' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Burgers' }));
    expect(
      screen.getByRole('heading', { name: 'No bites found' }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Clear search & filters' }),
    );
    expect(
      screen.getByRole('link', { name: 'Choose The Classic Smash' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: 'Under RM 20' }));
    expect(
      screen.queryByRole('link', { name: 'Choose The Classic Smash' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Choose Chocolate Hug' }),
    ).toBeInTheDocument();
  });
  it('supports options, quantities, persisted carts and independent restaurant removal', async () => {
    const user = userEvent.setup();
    mount('/food/burger');
    await screen.findByRole('heading', { name: 'The Classic Smash' });
    await user.click(screen.getByRole('radio', { name: /Extra cheese/ }));
    await user.click(
      screen.getByRole('button', {
        name: 'Increase quantity for The Classic Smash',
      }),
    );
    await user.click(screen.getByRole('button', { name: /Add to cart/ }));
    await user.click(screen.getByRole('link', { name: 'Review your cart →' }));
    const bun = await screen.findByRole('region', { name: 'The Good Bun' });
    expect(within(bun).getByText('RM 59.80')).toBeInTheDocument();
    await user.click(
      within(bun).getByRole('button', {
        name: 'Decrease quantity for The Classic Smash',
      }),
    );
    expect(within(bun).getByText('RM 32.40')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Keep discovering' }));
    await user.click(
      await screen.findByRole('link', { name: 'Choose Chocolate Hug' }),
    );
    await user.click(
      await screen.findByRole('button', { name: /Add to cart/ }),
    );
    await user.click(screen.getByRole('link', { name: 'Review your cart →' }));
    expect(
      await screen.findByRole('region', { name: 'Green Table' }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', {
        name: 'Remove restaurant order from The Good Bun',
      }),
    );
    expect(
      screen.queryByRole('region', { name: 'The Good Bun' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Green Table' }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!).items,
      ).toHaveLength(1),
    );
    await user.click(
      screen.getByRole('button', { name: 'Remove Chocolate Hug' }),
    );
    expect(
      screen.getByRole('heading', { name: 'Your next favourite is waiting' }),
    ).toBeInTheDocument();
  });
  it('submits one demo order per restaurant and clears the cart only after success', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        items: [
          {
            key: 'burger:',
            menuItemId: 'burger',
            restaurantId: 'bun',
            quantity: 1,
            optionIds: [],
          },
          {
            key: 'cake:',
            menuItemId: 'cake',
            restaurantId: 'green',
            quantity: 1,
            optionIds: [],
          },
        ],
      }),
    );
    mount('/checkout');
    await screen.findByRole('heading', { name: 'Your order details' });
    await user.click(
      screen.getByRole('radio', { name: 'Pickup · no delivery fees' }),
    );
    await user.type(
      screen.getByRole('textbox', { name: /Name/ }),
      'Demo Guest',
    );
    await user.type(
      screen.getByRole('textbox', { name: /Phone number/ }),
      '0123456789',
    );
    await user.click(screen.getByRole('button', { name: 'Place demo orders' }));
    expect(
      await screen.findByRole('heading', {
        name: 'That’s a delicious choice.',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Demo confirmed')).toHaveLength(2);
    expect(screen.getByText('RM 37.80')).toBeInTheDocument();
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!).items).toEqual(
        [],
      ),
    );
  });
  it('keeps the cart available after submission errors', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        items: [
          {
            key: 'cake:',
            menuItemId: 'cake',
            restaurantId: 'green',
            quantity: 1,
            optionIds: [],
          },
        ],
      }),
    );
    mount('/checkout', createMockServices({ latency: 0, orderError: true }));
    await screen.findByRole('heading', { name: 'Your order details' });
    await user.click(
      screen.getByRole('radio', { name: 'Pickup · no delivery fees' }),
    );
    await user.type(
      screen.getByRole('textbox', { name: /Name/ }),
      'Demo Guest',
    );
    await user.type(
      screen.getByRole('textbox', { name: /Phone number/ }),
      '0123456789',
    );
    await user.click(screen.getByRole('button', { name: 'Place demo order' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'could not be created',
    );
    expect(
      JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!).items,
    ).toHaveLength(1);
    expect(
      screen.getByRole('button', { name: 'Place demo order' }),
    ).toBeEnabled();
  });
  it('shows repository errors and an accessible retry action', async () => {
    mount('/', createMockServices({ latency: 0, scenario: 'error' }));
    expect(
      await screen.findByRole('heading', {
        name: 'The menu needs another moment',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeEnabled();
  });
});
