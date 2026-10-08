import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { useCart } from '../features/cart/cartContext';
import { useCatalog } from '../features/catalog/catalogContext';
import { Icon } from '../components/ui/Icon';
import { money } from '../utils/money';
import styles from './shell.module.css';
export function AppShell() {
  const { count, total, message } = useCart();
  const { loading } = useCatalog();
  const location = useLocation();
  useEffect(() => {
    if (loading) return;
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
    const heading = document.querySelector<HTMLElement>('main h1');
    heading?.focus({ preventScroll: true });
    document.title = `${heading?.textContent ?? 'Good food, good mood'} — Savour`;
  }, [location.pathname, location.hash, loading]);
  return (
    <>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link to="/" className={styles.brand} aria-label="Savour home">
            <span className={styles.brandMark}>s</span>savour
            <span className={styles.brandDot}>.</span>
          </Link>
          <nav aria-label="Main navigation" className={styles.nav}>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive && !location.hash ? styles.active : ''
              }
            >
              Discover
            </NavLink>
            <Link
              to="/#restaurants"
              className={location.hash === '#restaurants' ? styles.active : ''}
            >
              Restaurants
            </Link>
          </nav>
          <div className={styles.location}>
            <Icon name="pin" size={19} />
            <div>
              <span>Good food near you</span>
              <strong>Bangsar, Kuala Lumpur</strong>
            </div>
          </div>
          <Link to="/cart" className={styles.cartLink}>
            <Icon name="bag" />
            <span>Cart</span>
            <span className={styles.count} aria-label={`${count} items`}>
              {count}
            </span>
          </Link>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <div>
            <Link to="/" className={styles.footerBrand}>
              savour.
            </Link>
            <p>A little local. A lot delicious.</p>
          </div>
          <p>
            Made for good food moments.
            <br />
            <span>Frontend demo · No real orders or payments</span>
          </p>
        </div>
      </footer>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={message ? styles.toast : 'sr-only'}
      >
        {message && (
          <>
            <Icon name="check" />
            <span>{message}</span>
            <Link to="/cart">View cart</Link>
          </>
        )}
      </div>
      {count > 0 &&
        !['/cart', '/checkout', '/confirmation'].includes(
          location.pathname,
        ) && (
          <Link className={styles.mobileCart} to="/cart">
            <span>
              <Icon name="bag" /> View cart <b>{count}</b>
            </span>
            <strong>
              {money(total)} <Icon name="arrow" size={18} />
            </strong>
          </Link>
        )}
    </>
  );
}
