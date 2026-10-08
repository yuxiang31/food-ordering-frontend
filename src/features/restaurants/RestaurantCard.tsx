import { Link } from 'react-router';
import type { Restaurant } from '../../models';
import { FoodImage } from '../../components/ui/Controls';
import { Icon } from '../../components/ui/Icon';
import { money } from '../../utils/money';
import styles from '../catalog/catalog.module.css';
export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <article className={styles.restaurantCard}>
      <Link
        to={`/restaurants/${restaurant.id}`}
        className={styles.restaurantImage}
      >
        <FoodImage
          src={restaurant.image}
          alt={`${restaurant.name} dining space`}
        />
        <span className={styles.badge}>{restaurant.tags[0]}</span>
      </Link>
      <div className={styles.restaurantBody}>
        <div className={styles.restaurantTitle}>
          <h3>
            <Link to={`/restaurants/${restaurant.id}`}>{restaurant.name}</Link>
          </h3>
          <span>
            <Icon name="star" size={13} />
            {restaurant.rating}
          </span>
        </div>
        <p>{restaurant.cuisine}</p>
        <div className={styles.restaurantMeta}>
          <span>
            <Icon name="clock" size={14} />
            {restaurant.deliveryMinutes} min
          </span>
          <span>Delivery {money(restaurant.deliveryFee)}</span>
        </div>
      </div>
    </article>
  );
}
