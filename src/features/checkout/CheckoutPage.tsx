import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../cart/cartContext';
import { useCatalog } from '../catalog/catalogContext';
import { OrderSummary, FulfillmentPicker } from '../cart/OrderSummary';
import { useServices } from '../../app/servicesContext';
import { Button, StateBlock } from '../../components/ui/Controls';
import { Icon } from '../../components/ui/Icon';
import type { GuestDetails } from '../../models';
import styles from './checkout.module.css';
import { PHONE_PATTERN, validPhone } from './validation';
export default function CheckoutPage() {
  const cart = useCart();
  const { loading, error: catalogError, retry } = useCatalog();
  const { orders } = useServices();
  const navigate = useNavigate();
  const form = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => () => controller.current?.abort(), []);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current || !cart.groups.length) return;
    const fields = new FormData(event.currentTarget);
    const guest: GuestDetails = {
      name: String(fields.get('name') ?? '').trim(),
      phone: String(fields.get('phone') ?? '').trim(),
      address: String(fields.get('address') ?? '').trim(),
      notes: String(fields.get('notes') ?? '').trim(),
    };
    if (
      !guest.name ||
      !validPhone(guest.phone) ||
      (cart.fulfillment === 'delivery' && !guest.address)
    ) {
      setError(
        'Enter your name, a phone number with 8–15 digits, and a delivery address when needed.',
      );
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError('');
    controller.current = new AbortController();
    try {
      const receipt = await orders.submit(
        { groups: cart.groups, fulfillment: cart.fulfillment, guest },
        controller.current.signal,
      );
      if (controller.current.signal.aborted) return;
      cart.clear();
      navigate('/confirmation', { state: { receipt }, replace: true });
    } catch (cause: unknown) {
      if (!controller.current.signal.aborted)
        setError(
          cause instanceof Error
            ? cause.message
            : 'Unable to create the demo order. Please try again.',
        );
    } finally {
      submitting.current = false;
      if (!controller.current.signal.aborted) setBusy(false);
    }
  };
  return (
    <div className="container page">
      <Link to="/cart" className="back-link">
        <Icon name="back" size={18} />
        Back to your cart
      </Link>
      <span className="eyebrow">ONE LAST LITTLE STEP</span>
      <h1 tabIndex={-1}>Ready when you are.</h1>
      <p className={styles.subtitle}>
        Review your details and try the ordering experience.
      </p>
      <p className={`notice ${styles.demoNotice}`}>
        <strong>This is a demo checkout.</strong> No payment is collected and no
        restaurant receives an order. Please use sample details.
      </p>
      {loading ? (
        <StateBlock title="Checking your order…" loading />
      ) : catalogError ? (
        <StateBlock
          title="Unable to check your order"
          action={<Button onClick={retry}>Try again</Button>}
        >
          {catalogError}
        </StateBlock>
      ) : !cart.groups.length ? (
        <StateBlock
          title="Add a little delicious first"
          action={
            <Link className="link-button" to="/">
              Discover food
            </Link>
          }
        >
          Your cart is empty. Choose a dish before checking out.
        </StateBlock>
      ) : (
        <div className={styles.layout}>
          <form
            id="checkout-form"
            ref={form}
            onSubmit={submit}
            className={styles.form}
          >
            <fieldset disabled={busy} className={styles.formFields}>
              <h2>Your order details</h2>
              <FulfillmentPicker />
              <div className={styles.formRow}>
                <label htmlFor="guest-name">
                  Name <span>(required)</span>
                  <input
                    id="guest-name"
                    name="name"
                    autoComplete="name"
                    required
                    minLength={1}
                    maxLength={80}
                    placeholder="Alex Tan"
                  />
                </label>
                <label htmlFor="guest-phone">
                  Phone number <span>(required)</span>
                  <input
                    id="guest-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    pattern={PHONE_PATTERN}
                    maxLength={20}
                    placeholder="012 345 6789"
                  />
                </label>
              </div>
              {cart.fulfillment === 'delivery' ? (
                <label htmlFor="guest-address">
                  Delivery address <span>(required)</span>
                  <textarea
                    id="guest-address"
                    name="address"
                    autoComplete="street-address"
                    required
                    maxLength={250}
                    rows={3}
                    placeholder="Unit, building, street, and postcode"
                  />
                </label>
              ) : (
                <div className={styles.pickup}>
                  <h3>Collect from each kitchen</h3>
                  {cart.groups.map((group) => (
                    <p key={group.restaurant.id}>
                      <strong>{group.restaurant.name}</strong>
                      <span>{group.restaurant.address}</span>
                    </p>
                  ))}
                </div>
              )}
              <label htmlFor="guest-notes">
                Order notes <span>(optional)</span>
                <textarea
                  id="guest-notes"
                  name="notes"
                  maxLength={300}
                  rows={3}
                  placeholder="Anything the kitchens should know?"
                />
              </label>
              <p className={styles.privacy}>
                Your contact details are used only for this demo submission and
                are not saved to browser storage.
              </p>
              {error && (
                <p className="error-message" role="alert">
                  {error}
                </p>
              )}
            </fieldset>
          </form>
          <OrderSummary>
            <Button
              type="submit"
              form="checkout-form"
              disabled={busy}
              className={styles.submit}
            >
              {busy
                ? 'Creating demo orders…'
                : `Place ${cart.groups.length > 1 ? 'demo orders' : 'demo order'}`}
              <Icon name="arrow" size={18} />
            </Button>
            <p className={styles.submitNote}>
              Creates a separate demo order for each restaurant.
            </p>
          </OrderSummary>
        </div>
      )}
    </div>
  );
}
