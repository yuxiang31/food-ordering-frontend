import { Link } from 'react-router';
import type { MenuItem, Restaurant } from '../../models';
import { FoodImage } from '../../components/ui/Controls';
import { Icon } from '../../components/ui/Icon';
import { money } from '../../utils/money';
import styles from './catalog.module.css';
export function FoodCard({
  item,
  restaurant,
}: {
  item: MenuItem;
  restaurant: Restaurant;
}) {
  return (
    <article className={styles.foodCard}>
      <Link
        to={`/food/${item.id}`}
        className={styles.cardImageLink}
        aria-label={`View ${item.name}`}
      >
        <FoodImage
          src={item.image}
          alt={item.name}
          className={styles.cardImage}
        />
        <span
          className={`${styles.badge} ${item.dietary === 'vegetarian' ? styles.greenBadge : ''}`}
        >
          {item.dietary === 'vegetarian' && <Icon name="leaf" size={12} />}
          {item.tags[0]}
        </span>
      </Link>
      <div className={styles.cardBody}>
        <div className={styles.restaurantLine}>
          <Link to={`/restaurants/${restaurant.id}`}>{restaurant.name}</Link>
          <span>
            <Icon name="star" size={12} />
            {item.rating.toFixed(1)}
          </span>
        </div>
        <h3>
          <Link to={`/food/${item.id}`}>{item.name}</Link>
        </h3>
        <p className={styles.foodDescription}>{item.description}</p>
        <div className={styles.cardBottom}>
          <strong>{money(item.price)}</strong>
          <Link
            to={`/food/${item.id}`}
            className={styles.addLink}
            aria-label={`Choose ${item.name}`}
          >
            <Icon name="plus" size={18} />
            <span>Choose</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
