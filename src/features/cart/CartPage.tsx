import { Link } from 'react-router';
import { useCart } from './cartContext';
import { useCatalog } from '../catalog/catalogContext';
import { OrderSummary, FulfillmentPicker } from './OrderSummary';
import {
  Button,
  FoodImage,
  QuantitySelector,
  StateBlock,
} from '../../components/ui/Controls';
import { Icon } from '../../components/ui/Icon';
import { money } from '../../utils/money';
import styles from './cart.module.css';
export function CartPage() {
  const cart = useCart();
  const { loading, error, retry } = useCatalog();
  return (
    <div className="container page">
      <Link to="/" className="back-link">
        <Icon name="back" size={18} />
        Keep discovering
      </Link>
      <div className={styles.pageHeading}>
        <div>
          <span className="eyebrow">YOUR GOOD FOOD MOMENT</span>
          <h1 tabIndex={-1}>Your cart</h1>
          <p>All your cravings, together. Each kitchen has its own order.</p>
        </div>
        <span className={styles.itemCount}>
          {cart.count} {cart.count === 1 ? 'item' : 'items'}
        </span>
      </div>
      {loading ? (
        <StateBlock title="Checking your cart…" loading />
      ) : error ? (
        <StateBlock
          title="We couldn’t check your cart"
          action={<Button onClick={retry}>Try again</Button>}
        >
          {error}
        </StateBlock>
      ) : !cart.groups.length ? (
        <StateBlock
          title="Your next favourite is waiting"
          action={
            <Link className="link-button" to="/">
              Find something delicious <Icon name="arrow" size={18} />
            </Link>
          }
        >
          Your cart is empty. Add a dish from any of our local kitchens to get
          started.
        </StateBlock>
      ) : (
        <>
          <FulfillmentPicker />
          <div className={styles.layout}>
            <div className={styles.groups}>
              {cart.groups.map((group) => (
                <section
                  className={styles.group}
                  key={group.restaurant.id}
                  aria-labelledby={`restaurant-${group.restaurant.id}`}
                >
                  <header className={styles.groupHeader}>
                    <div className={styles.restaurantIcon}>
                      <Icon name="store" size={23} />
                    </div>
                    <div>
                      <h2 id={`restaurant-${group.restaurant.id}`}>
                        <Link to={`/restaurants/${group.restaurant.id}`}>
                          {group.restaurant.name}
                        </Link>
                      </h2>
                      <p>
                        <Icon name="clock" size={13} />
                        {group.restaurant.deliveryMinutes} min ·{' '}
                        {cart.fulfillment === 'delivery'
                          ? `${money(group.deliveryFee)} delivery`
                          : 'Pickup at restaurant'}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={styles.removeGroup}
                      onClick={() => cart.removeRestaurant(group.restaurant.id)}
                      aria-label={`Remove restaurant order from ${group.restaurant.name}`}
                    >
                      <Icon name="trash" size={15} />
                      <span>Remove order</span>
                    </button>
                  </header>
                  <div className={styles.cartItems}>
                    {group.items.map((item) => (
                      <article className={styles.cartItem} key={item.key}>
                        <FoodImage
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                        />
                        <div className={styles.itemDetails}>
                          <h3>{item.menuItem.name}</h3>
                          <p>
                            {item.options.length
                              ? item.options
                                  .map((option) => option.label)
                                  .join(' · ')
                              : 'Original recipe'}
                          </p>
                          <span className={styles.unitPrice}>
                            {money(item.unitPrice)} each
                          </span>
                          <div className={styles.itemActions}>
                            <Link
                              to={`/food/${item.menuItemId}?edit=${encodeURIComponent(item.key)}`}
                            >
                              Edit options
                            </Link>
                            <button
                              onClick={() => cart.remove(item.key)}
                              aria-label={`Remove ${item.menuItem.name}`}
                            >
                              Remove item
                            </button>
                          </div>
                        </div>
                        <div className={styles.itemRight}>
                          <strong>{money(item.lineTotal)}</strong>
                          <QuantitySelector
                            value={item.quantity}
                            onChange={(quantity) =>
                              cart.quantity(item.key, quantity)
                            }
                            label={item.menuItem.name}
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                  <div className={styles.groupTotal}>
                    <span>
                      Restaurant total{' '}
                      <small>
                        including{' '}
                        {cart.fulfillment === 'delivery'
                          ? 'delivery'
                          : 'free pickup'}
                      </small>
                    </span>
                    <strong>{money(group.total)}</strong>
                  </div>
                </section>
              ))}
            </div>
            <OrderSummary>
              <Link
                to="/checkout"
                className={`link-button ${styles.checkoutLink}`}
              >
                Continue to checkout <Icon name="arrow" size={18} />
              </Link>
              <Link to="/" className={styles.addMore}>
                Add more delicious things
              </Link>
            </OrderSummary>
          </div>
        </>
      )}
    </div>
  );
}
