import { Link, useSearchParams } from 'react-router';
import type { FormEvent } from 'react';
import { useCatalog } from './catalogContext';
import { FoodCard } from './FoodCard';
import { RestaurantCard } from '../restaurants/RestaurantCard';
import { Icon } from '../../components/ui/Icon';
import { Button, FoodImage, StateBlock } from '../../components/ui/Controls';
import styles from './catalog.module.css';
export function DiscoverPage() {
  const { data, loading, error, retry } = useCatalog();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const vegetarian = params.get('veg') === '1';
  const budget = params.get('budget') === '1';
  const sort = params.get('sort') ?? 'popular';
  const update = (name: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next, { preventScrollReset: true });
  };
  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update(
      'q',
      String(new FormData(event.currentTarget).get('search') ?? '').trim(),
    );
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };
  const items = (data?.menuItems ?? [])
    .filter((item) => {
      const restaurant = data?.restaurants.find(
        (restaurant) => restaurant.id === item.restaurantId,
      );
      const haystack =
        `${item.name} ${item.description} ${restaurant?.name ?? ''} ${restaurant?.cuisine ?? ''}`.toLocaleLowerCase();
      return (
        (!query || haystack.includes(query.toLocaleLowerCase())) &&
        (!category || item.categoryId === category) &&
        (!vegetarian || item.dietary === 'vegetarian') &&
        (!budget || item.price < 2000)
      );
    })
    .sort((a, b) =>
      sort === 'price'
        ? a.price - b.price
        : sort === 'rating'
          ? b.rating - a.rating
          : 0,
    );
  return (
    <div className="container">
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            FRESH FROM YOUR NEIGHBOURHOOD
          </div>
          <h1 id="hero-heading" tabIndex={-1}>
            Good food.
            <br />
            <span>Great mood.</span>
          </h1>
          <p>
            Your local favourites and new cravings,
            <br className={styles.desktopBreak} /> all just a few bites away.
          </p>
          <a href="#menu" className="link-button">
            Find your next favourite <Icon name="arrow" size={18} />
          </a>
          <div className={styles.heroProof}>
            <span className={styles.miniAvatars}>
              <span>🍜</span>
              <span>🥗</span>
              <span>🍔</span>
            </span>
            <div>
              <strong>Locally made. Lovingly delivered.</strong>
              <span>Good meals from independent kitchens.</span>
            </div>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <FoodImage
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85"
            alt="A colourful bowl of fresh vegetables and grains"
            eager
            className={styles.heroImage}
          />
          <div className={styles.heroStamp}>
            <Icon name="leaf" size={17} />
            <span>
              Freshly made
              <br />
              <b>never ordinary.</b>
            </span>
          </div>
          <div className={styles.heroNote}>
            <span>✦</span> A little something for every craving
          </div>
        </div>
      </section>
      <section
        className={styles.browse}
        id="menu"
        aria-labelledby="browse-heading"
      >
        <div className={styles.sectionTop}>
          <div>
            <span className="eyebrow">LET YOUR CRAVINGS LEAD</span>
            <h2 id="browse-heading">What sounds good?</h2>
          </div>
          <form onSubmit={search} role="search" className={styles.search}>
            <Icon name="search" />
            <label className="sr-only" htmlFor="food-search">
              Search food or restaurants
            </label>
            <input
              key={query}
              id="food-search"
              name="search"
              defaultValue={query}
              placeholder="Search food or restaurants"
              maxLength={100}
            />
            <button type="submit" aria-label="Search">
              <Icon name="arrow" size={18} />
            </button>
          </form>
        </div>
        <div
          className={styles.categories}
          role="group"
          aria-label="Food categories"
        >
          <button
            className={`${styles.category} ${!category ? styles.categorySelected : ''}`}
            aria-pressed={!category}
            onClick={() => update('category', '')}
          >
            <span className={styles.categorySymbol}>
              <Icon name="grid" size={26} />
            </span>
            <span>All food</span>
          </button>
          {(data?.categories ?? []).map((cat) => (
            <button
              key={cat.id}
              className={`${styles.category} ${category === cat.id ? styles.categorySelected : ''}`}
              aria-pressed={category === cat.id}
              onClick={() => update('category', cat.id)}
            >
              <span className={styles.categorySymbol} aria-hidden="true">
                {cat.symbol}
              </span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
        <div className={styles.sectionTop}>
          <div>
            <h2 className={styles.foodHeading}>
              {query
                ? `Results for “${query}”`
                : category
                  ? `${data?.categories.find((cat) => cat.id === category)?.name ?? 'Food'} to love`
                  : 'A few things you’ll love'}
            </h2>
            <p className={styles.sectionSubtitle}>
              {query || category || vegetarian || budget
                ? `${items.length} delicious ${items.length === 1 ? 'option' : 'options'} found`
                : 'Tried, loved, and ready for your table.'}
            </p>
          </div>
          <div className={styles.filters}>
            <label className={styles.filterCheck}>
              <input
                type="checkbox"
                checked={vegetarian}
                onChange={(event) =>
                  update('veg', event.target.checked ? '1' : '')
                }
              />
              <Icon name="leaf" size={14} />
              Vegetarian
            </label>
            <label className={styles.filterCheck}>
              <input
                type="checkbox"
                checked={budget}
                onChange={(event) =>
                  update('budget', event.target.checked ? '1' : '')
                }
              />
              Under RM 20
            </label>
            <label className={styles.sort}>
              <span className="sr-only">Sort food</span>
              <select
                value={sort}
                onChange={(event) => update('sort', event.target.value)}
              >
                <option value="popular">Popular picks</option>
                <option value="price">Price: low to high</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>
        </div>
        {loading ? (
          <StateBlock title="Something delicious is on its way…" loading>
            Loading menus from your local kitchens.
          </StateBlock>
        ) : error ? (
          <StateBlock
            title="The menu needs another moment"
            action={<Button onClick={retry}>Try again</Button>}
          >
            {error}
          </StateBlock>
        ) : !items.length ? (
          <StateBlock
            title="No bites found"
            action={
              <Button variant="secondary" onClick={() => setParams({})}>
                Clear search & filters
              </Button>
            }
          >
            Try another search or a different category.
          </StateBlock>
        ) : (
          <div className={styles.foodGrid}>
            {items.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                restaurant={data!.restaurants.find(
                  (restaurant) => restaurant.id === item.restaurantId,
                )!}
              />
            ))}
          </div>
        )}
      </section>
      <section
        className={styles.restaurants}
        id="restaurants"
        aria-labelledby="restaurants-heading"
      >
        <div className={styles.sectionTop}>
          <div>
            <span className="eyebrow">MEET THE MAKERS</span>
            <h2 id="restaurants-heading">Local kitchens. Big flavour.</h2>
            <p className={styles.sectionSubtitle}>
              Your neighbourhood’s best, all in one place.
            </p>
          </div>
          <span className={styles.localLabel}>
            <Icon name="pin" size={16} />
            Bangsar, Kuala Lumpur
          </span>
        </div>
        <div className={styles.restaurantGrid}>
          {data?.restaurants
            .filter(
              (restaurant) =>
                !query ||
                `${restaurant.name} ${restaurant.cuisine}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
            )
            .map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
        </div>
        {data && !data.restaurants.length && (
          <p className="muted">More local kitchens are coming soon.</p>
        )}
      </section>
      <section className={styles.bottomBanner}>
        <div className={styles.bannerIcon}>
          <Icon name="bag" size={32} />
        </div>
        <div>
          <span className="eyebrow">MORE FLAVOUR, LESS FUSS</span>
          <h2>Different cravings. One happy cart.</h2>
          <p>
            Mix favourites from different kitchens. Review every restaurant’s
            order in one place.
          </p>
        </div>
        <Link to="/cart" className="link-button secondary-link">
          View your cart <Icon name="arrow" size={17} />
        </Link>
      </section>
    </div>
  );
}
