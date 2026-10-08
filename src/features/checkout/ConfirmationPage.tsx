import { Link, useLocation } from 'react-router';
import type { OrderReceipt } from '../../models';
import { Icon } from '../../components/ui/Icon';
import { StateBlock } from '../../components/ui/Controls';
import { money } from '../../utils/money';
import styles from './checkout.module.css';
function isReceipt(value: unknown): value is OrderReceipt {
  if (!value || typeof value !== 'object') return false;
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'orders' in value &&
    Array.isArray(value.orders) &&
    value.orders.length > 0 &&
    'total' in value &&
    typeof value.total === 'number'
  );
}
export function ConfirmationPage() {
  const location = useLocation();
  const state: unknown = location.state;
  const receipt: unknown =
    state && typeof state === 'object' && 'receipt' in state
      ? state.receipt
      : null;
  if (!isReceipt(receipt))
    return (
      <div className="container page">
        <h1 className="sr-only" tabIndex={-1}>
          Demo confirmation
        </h1>
        <StateBlock
          title="No demo order to show"
          action={
            <Link to="/" className="link-button">
              Discover food
            </Link>
          }
        >
          Complete demo checkout to see your restaurant orders here.
        </StateBlock>
      </div>
    );
  return (
    <div className={`container page ${styles.confirmation}`}>
      <span className={styles.successIcon}>
        <Icon name="check" size={38} />
      </span>
      <span className="eyebrow">A TASTE OF WHAT’S TO COME</span>
      <h1 tabIndex={-1}>That’s a delicious choice.</h1>
      <p className={styles.subtitle}>
        Your demo checkout is complete. Each restaurant has its own order.
      </p>
      <p className="notice">
        Demo only — no payment was taken and no real orders were sent.
      </p>
      <div className={styles.receiptHeading}>
        <span>
          Demo reference <strong>{receipt.id}</strong>
        </span>
        <span>
          {receipt.fulfillment === 'delivery' ? 'Delivery' : 'Pickup'} ·{' '}
          {receipt.orders.length}{' '}
          {receipt.orders.length === 1 ? 'kitchen' : 'kitchens'}
        </span>
      </div>
      <div className={styles.receipts}>
        {receipt.orders.map((order) => (
          <section key={order.id} className={styles.receipt}>
            <div>
              <Icon name="store" size={24} />
              <h2>{order.restaurantName}</h2>
              <span>Demo confirmed</span>
            </div>
            <p className={styles.reference}>Order {order.id}</p>
            {order.items.map((item) => (
              <div className={styles.receiptItem} key={item.key}>
                <div>
                  <strong>
                    {item.quantity} × {item.menuItem.name}
                  </strong>
                  <small>
                    {item.options.map((option) => option.label).join(' · ') ||
                      'Original recipe'}
                  </small>
                </div>
                <span>{money(item.lineTotal)}</span>
              </div>
            ))}
            <div className={styles.receiptFee}>
              <span>
                {receipt.fulfillment === 'delivery' ? 'Delivery fee' : 'Pickup'}
              </span>
              <span>
                {order.deliveryFee ? money(order.deliveryFee) : 'Free'}
              </span>
            </div>
            <div className={styles.receiptTotal}>
              <strong>Restaurant total</strong>
              <strong>{money(order.total)}</strong>
            </div>
          </section>
        ))}
      </div>
      <div className={styles.grandTotal}>
        <span>Combined total</span>
        <strong>{money(receipt.total)}</strong>
      </div>
      <Link to="/" className="link-button">
        Discover more good food <Icon name="arrow" size={18} />
      </Link>
    </div>
  );
}
