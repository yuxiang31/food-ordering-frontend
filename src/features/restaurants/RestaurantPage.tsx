import { Link, useParams } from 'react-router';
import { useCatalog } from '../catalog/catalogContext';
import { FoodCard } from '../catalog/FoodCard';
import { Button, FoodImage, StateBlock } from '../../components/ui/Controls';
import { Icon } from '../../components/ui/Icon';
import { money } from '../../utils/money';
import catalogStyles from '../catalog/catalog.module.css';
import styles from './restaurant.module.css';
export function RestaurantPage() {
  const { restaurantId } = useParams();
  const { data, loading, error, retry } = useCatalog();
  const restaurant = data?.restaurants.find(
    (restaurant) => restaurant.id === restaurantId,
  );
  if (loading)
    return (
      <StateBlock title="Loading this kitchen…" loading headingLevel={1} />
    );
  if (error)
    return (
      <StateBlock
        title="Unable to load this kitchen"
        headingLevel={1}
        action={<Button onClick={retry}>Try again</Button>}
      >
        {error}
      </StateBlock>
    );
  if (!restaurant)
    return (
      <StateBlock
        title="Kitchen not found"
        headingLevel={1}
        action={
          <Link className="link-button" to="/">
            Discover food
          </Link>
        }
      >
        Let’s find you another favourite.
      </StateBlock>
    );
  return (
    <div className="container page">
      <Link to="/#restaurants" className="back-link">
        <Icon name="back" size={18} />
        All restaurants
      </Link>
      <section className={styles.restaurantHero}>
        <FoodImage
          src={restaurant.image}
          alt={`${restaurant.name} dining space`}
          eager
        />
        <div>
          <span className="eyebrow">YOUR NEIGHBOURHOOD KITCHEN</span>
          <h1 tabIndex={-1}>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div className={styles.metadata}>
            <span>
              <Icon name="star" />
              {restaurant.rating} ({restaurant.reviewCount} demo reviews)
            </span>
            <span>
              <Icon name="clock" />
              {restaurant.deliveryMinutes} min
            </span>
            <span>
              <Icon name="delivery" />
              {money(restaurant.deliveryFee)} delivery
            </span>
          </div>
          <p className={styles.address}>
            <Icon name="pin" size={16} />
            {restaurant.address}
          </p>
        </div>
      </section>
      <h2 className={styles.menuHeading}>Made fresh for you</h2>
      <div className={catalogStyles.foodGrid}>
        {data?.menuItems
          .filter((item) => item.restaurantId === restaurant.id)
          .map((item) => (
            <FoodCard key={item.id} item={item} restaurant={restaurant} />
          ))}
      </div>
    </div>
  );
}
