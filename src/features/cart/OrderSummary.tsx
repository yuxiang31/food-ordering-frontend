import { useCart } from './cartContext';
import { money } from '../../utils/money';
import type { PropsWithChildren } from 'react';
import styles from './cart.module.css';
export function OrderSummary({ children }: PropsWithChildren) {
  const { groups, total, fulfillment } = useCart();
  const subtotal = groups.reduce((sum, group) => sum + group.subtotal, 0);
  return (
    <aside className={styles.summary} aria-labelledby="summary-heading">
      <h2 id="summary-heading">Order summary</h2>
      <p className={styles.summaryIntro}>
        {groups.length} {groups.length === 1 ? 'restaurant' : 'restaurants'} ·
        One easy checkout
      </p>
      {groups.map((group) => (
        <div key={group.restaurant.id} className={styles.summaryGroup}>
          <strong>{group.restaurant.name}</strong>
          <div>
            <span>Food subtotal</span>
            <span>{money(group.subtotal)}</span>
          </div>
          <div>
            <span>{fulfillment === 'delivery' ? 'Delivery' : 'Pickup'}</span>
            <span>{group.deliveryFee ? money(group.deliveryFee) : 'Free'}</span>
          </div>
        </div>
      ))}
      <div className={styles.summarySubtotal}>
        <span>Items subtotal</span>
        <span>{money(subtotal)}</span>
      </div>
      <div className={styles.summarySubtotal}>
        <span>Total delivery fees</span>
        <span>{money(total - subtotal)}</span>
      </div>
      <div className={styles.summaryTotal}>
        <span>Total</span>
        <strong>{money(total)}</strong>
      </div>
      <p className={styles.summaryNote}>
        All prices in MYR. Demo totals include displayed fees; no extra charges.
      </p>
      {children}
      <div className={styles.summaryFootnote}>
        Each kitchen prepares its own order. Delivery times may differ.
      </div>
    </aside>
  );
}
export function FulfillmentPicker() {
  const { fulfillment, setFulfillment } = useCart();
  return (
    <fieldset className={styles.fulfillment}>
      <legend>How would you like your food?</legend>
      <div>
        <label>
          <input
            type="radio"
            name="fulfillment"
            value="delivery"
            checked={fulfillment === 'delivery'}
            onChange={() => setFulfillment('delivery')}
          />
          Delivery
        </label>
        <label>
          <input
            type="radio"
            name="fulfillment"
            value="pickup"
            checked={fulfillment === 'pickup'}
            onChange={() => setFulfillment('pickup')}
          />
          Pickup · no delivery fees
        </label>
      </div>
    </fieldset>
  );
}
