import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { useCatalog } from './catalogContext';
import { useCart } from '../cart/cartContext';
import { cartKey, validOptions } from '../cart/cartLogic';
import type { MenuItem, Restaurant } from '../../models';
import {
  Button,
  FoodImage,
  QuantitySelector,
  StateBlock,
} from '../../components/ui/Controls';
import { Icon } from '../../components/ui/Icon';
import { money } from '../../utils/money';
import styles from './details.module.css';
export function FoodDetailsPage() {
  const { foodId } = useParams();
  const [params] = useSearchParams();
  const { data, loading, error, retry } = useCatalog();
  const item = data?.menuItems.find((item) => item.id === foodId);
  const restaurant = data?.restaurants.find(
    (restaurant) => restaurant.id === item?.restaurantId,
  );
  if (loading)
    return (
      <StateBlock
        title="Loading something delicious…"
        loading
        headingLevel={1}
      />
    );
  if (error)
    return (
      <StateBlock
        title="Unable to load food"
        headingLevel={1}
        action={<Button onClick={retry}>Try again</Button>}
      >
        {error}
      </StateBlock>
    );
  if (!item || !restaurant)
    return (
      <StateBlock
        title="This dish isn’t on the menu"
        headingLevel={1}
        action={
          <Link className="link-button" to="/">
            Discover food
          </Link>
        }
      >
        Let’s find something else you’ll love.
      </StateBlock>
    );
  return (
    <FoodDetails
      key={`${item.id}-${params.get('edit') ?? ''}`}
      item={item}
      restaurant={restaurant}
      editKey={params.get('edit') ?? undefined}
    />
  );
}
function FoodDetails({
  item,
  restaurant,
  editKey,
}: {
  item: MenuItem;
  restaurant: Restaurant;
  editKey?: string;
}) {
  const cart = useCart();
  const [currentEditKey, setCurrentEditKey] = useState(editKey);
  const existing = cart.cart.items.find(
    (entry) => entry.key === currentEditKey && entry.menuItemId === item.id,
  );
  const [quantity, setQuantity] = useState(existing?.quantity ?? 1);
  const [selected, setSelected] = useState<string[]>(
    existing?.optionIds ??
      item.optionGroups
        .filter((group) => group.required)
        .map((group) => group.options[0].id),
  );
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const optionsTotal = item.optionGroups
    .flatMap((group) => group.options)
    .filter((option) => selected.includes(option.id))
    .reduce((sum, option) => sum + option.price, 0);
  const total = (item.price + optionsTotal) * quantity;
  const choose = (groupId: string, optionId: string) => {
    const group = item.optionGroups.find((group) => group.id === groupId)!;
    setSelected((current) => [
      ...current.filter(
        (id) => !group.options.some((option) => option.id === id),
      ),
      ...(optionId ? [optionId] : []),
    ]);
    setAdded(false);
  };
  const add = () => {
    if (!validOptions(item, selected)) {
      setError('Please choose an option for each required group.');
      return;
    }
    cart.add(item, quantity, selected, existing ? currentEditKey : undefined);
    if (existing) setCurrentEditKey(cartKey(item.id, selected));
    setAdded(true);
    setError('');
  };
  return (
    <div className="container page">
      <Link
        to={existing ? '/cart' : `/restaurants/${restaurant.id}`}
        className="back-link"
      >
        <Icon name="back" size={18} />
        {existing ? 'Back to your cart' : restaurant.name}
      </Link>
      <div className={styles.layout}>
        <div className={styles.visual}>
          <FoodImage src={item.image} alt={item.name} eager />
          <div className={styles.photoNote}>
            <Icon name="heart" size={15} />
            Made fresh at {restaurant.name}
          </div>
        </div>
        <div className={styles.content}>
          <Link
            to={`/restaurants/${restaurant.id}`}
            className={styles.restaurant}
          >
            <Icon name="store" size={17} />
            {restaurant.name}
            <Icon name="arrow" size={14} />
          </Link>
          <h1 tabIndex={-1}>{item.name}</h1>
          <div className={styles.meta}>
            <span>
              <Icon name="star" size={16} />
              {item.rating} · Demo rating
            </span>
            <span>
              <Icon name="clock" size={16} />
              {restaurant.deliveryMinutes} min
            </span>
            {item.dietary === 'vegetarian' && (
              <span>
                <Icon name="leaf" size={16} />
                Vegetarian
              </span>
            )}
          </div>
          <p className={styles.description}>{item.description}</p>
          <strong className={styles.price}>{money(item.price)}</strong>
          <p className={styles.allergy}>
            Menu descriptions are illustrative. In a live service, confirm
            ingredients and allergies with the restaurant.
          </p>
          {item.optionGroups.map((group) => (
            <fieldset key={group.id} className={styles.optionGroup}>
              <legend>
                {group.name}{' '}
                <span>
                  {group.required
                    ? 'Required · Choose one'
                    : 'Optional · Choose one'}
                </span>
              </legend>
              {!group.required && (
                <label className={styles.option}>
                  <input
                    type="radio"
                    name={group.id}
                    checked={
                      !group.options.some((option) =>
                        selected.includes(option.id),
                      )
                    }
                    onChange={() => choose(group.id, '')}
                  />
                  No extra<span>Included</span>
                </label>
              )}
              {group.options.map((option) => (
                <label key={option.id} className={styles.option}>
                  <input
                    type="radio"
                    name={group.id}
                    checked={selected.includes(option.id)}
                    onChange={() => choose(group.id, option.id)}
                  />
                  {option.label}
                  <span>
                    {option.price ? `+ ${money(option.price)}` : 'Included'}
                  </span>
                </label>
              ))}
            </fieldset>
          ))}
          {editKey && !existing && (
            <p className="notice">
              This item is no longer in your cart. You can add it again.
            </p>
          )}
          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}
          <div className={styles.addRow}>
            <QuantitySelector
              value={quantity}
              onChange={(value) => {
                setQuantity(value);
                setAdded(false);
              }}
              label={item.name}
            />
            <Button disabled={!item.available || added} onClick={add}>
              <Icon name={added ? 'check' : 'bag'} size={18} />
              {!item.available
                ? 'Currently unavailable'
                : added
                  ? 'Saved to cart'
                  : existing
                    ? 'Update item'
                    : 'Add to cart'}
              <span>{money(total)}</span>
            </Button>
          </div>
          <div className={styles.detailsFooter}>
            {added ? (
              <Link to="/cart" className="text-link">
                Review your cart →
              </Link>
            ) : (
              <span>
                Mix favourites from different restaurants in one cart.
              </span>
            )}
            <span>Maximum 20 per selection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
