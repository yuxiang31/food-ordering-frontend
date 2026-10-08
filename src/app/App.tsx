import { lazy, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router';
import type { Services } from '../services/repositories/contracts';
import { ServicesProvider } from './services';
import { CatalogProvider } from '../features/catalog/CatalogProvider';
import { CartProvider } from '../features/cart/CartProvider';
import { AppShell } from './AppShell';
import { DiscoverPage } from '../features/catalog/DiscoverPage';
import { RestaurantPage } from '../features/restaurants/RestaurantPage';
import { FoodDetailsPage } from '../features/catalog/FoodDetailsPage';
import { CartPage } from '../features/cart/CartPage';
import { ConfirmationPage } from '../features/checkout/ConfirmationPage';
import { StateBlock } from '../components/ui/Controls';
const CheckoutPage = lazy(() => import('../features/checkout/CheckoutPage'));
export function App({ services }: { services?: Services }) {
  return (
    <ServicesProvider services={services}>
      <CatalogProvider>
        <CartProvider>
          <Suspense
            fallback={<StateBlock title="Getting things ready…" loading />}
          >
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<DiscoverPage />} />
                <Route
                  path="restaurants/:restaurantId"
                  element={<RestaurantPage />}
                />
                <Route path="food/:foodId" element={<FoodDetailsPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="confirmation" element={<ConfirmationPage />} />
                <Route
                  path="*"
                  element={
                    <div className="container page">
                      <h1 tabIndex={-1}>This page is off the menu.</h1>
                      <StateBlock
                        title="Let’s find something delicious"
                        action={
                          <Link to="/" className="link-button">
                            Back to discovery
                          </Link>
                        }
                      >
                        The page you’re looking for isn’t available.
                      </StateBlock>
                    </div>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </CartProvider>
      </CatalogProvider>
    </ServicesProvider>
  );
}
