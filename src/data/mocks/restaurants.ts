import type { Restaurant } from '../../models';
export const restaurants: Restaurant[] = [
  {
    id: 'dapur',
    name: 'Dapur & Co.',
    cuisine: 'Malaysian comfort food',
    description:
      'The flavours you grew up with, made fresh every day. A little spice, a lot of heart.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    rating: 4.9,
    reviewCount: 284,
    deliveryMinutes: '20–30',
    deliveryFee: 450,
    tags: ['Local favourite', 'Comfort food'],
    address: '18 Jalan Telawi, Bangsar, Kuala Lumpur',
  },
  {
    id: 'bun',
    name: 'The Good Bun',
    cuisine: 'Burgers & stone-baked pizza',
    description:
      'Proper burgers. Hand-stretched pizza. All the good stuff, without the fuss.',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    rating: 4.8,
    reviewCount: 192,
    deliveryMinutes: '25–35',
    deliveryFee: 500,
    tags: ['Crowd pleaser', 'Made to order'],
    address: '7 Jalan Kemuja, Bangsar, Kuala Lumpur',
  },
  {
    id: 'green',
    name: 'Green Table',
    cuisine: 'Wholesome bowls & sweet treats',
    description:
      'Colourful, feel-good food. Seasonal greens, nourishing bowls, and something sweet to finish.',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80',
    rating: 4.7,
    reviewCount: 156,
    deliveryMinutes: '15–25',
    deliveryFee: 350,
    tags: ['Plant-friendly', 'Fresh daily'],
    address: '32 Jalan Maarof, Bangsar, Kuala Lumpur',
  },
];
