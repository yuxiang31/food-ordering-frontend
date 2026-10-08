import type { MenuItem, OptionGroup } from '../../models';
const spice: OptionGroup = {
  id: 'spice',
  name: 'Spice level',
  required: true,
  options: [
    { id: 'mild', label: 'Mild', price: 0 },
    { id: 'regular', label: 'Regular', price: 0 },
    { id: 'hot', label: 'Extra spicy', price: 0 },
  ],
};
const burger: OptionGroup = {
  id: 'burger-extra',
  name: 'Make it yours',
  required: false,
  options: [
    { id: 'cheese', label: 'Extra cheese', price: 250 },
    { id: 'patty', label: 'Extra beef patty', price: 650 },
  ],
};
export const menuItems: MenuItem[] = [
  {
    id: 'nasi',
    restaurantId: 'dapur',
    categoryId: 'local',
    name: 'Nasi Lemak Ayam',
    description:
      'Fragrant coconut rice, crispy spiced chicken, house sambal, egg, and all the classic sides.',
    price: 1890,
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    tags: ['Bestseller'],
    dietary: 'none',
    available: true,
    optionGroups: [spice],
  },
  {
    id: 'burger',
    restaurantId: 'bun',
    categoryId: 'burgers',
    name: 'The Classic Smash',
    description:
      'A juicy smashed beef patty, melted cheddar, pickles, and our signature sauce in a toasted bun.',
    price: 2490,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    tags: ['Popular'],
    dietary: 'none',
    available: true,
    optionGroups: [burger],
  },
  {
    id: 'bowl',
    restaurantId: 'green',
    categoryId: 'healthy',
    name: 'The Sunshine Bowl',
    description:
      'A colourful bowl of quinoa, roasted vegetables, avocado, and crisp greens with lemon tahini.',
    price: 2290,
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    tags: ['Vegetarian'],
    dietary: 'vegetarian',
    available: true,
    optionGroups: [
      {
        id: 'dressing',
        name: 'Your dressing',
        required: true,
        options: [
          { id: 'tahini', label: 'Lemon tahini', price: 0 },
          { id: 'balsamic', label: 'Balsamic vinaigrette', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'pizza',
    restaurantId: 'bun',
    categoryId: 'pizza',
    name: 'Margherita, Made Right',
    description:
      'Slow-fermented dough, rich tomato sauce, fresh mozzarella, and basil. Simple is delicious.',
    price: 2890,
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    tags: ['Vegetarian'],
    dietary: 'vegetarian',
    available: true,
    optionGroups: [
      {
        id: 'pizza-size',
        name: 'Pizza size',
        required: true,
        options: [
          { id: 'small', label: '10 inch', price: 0 },
          { id: 'large', label: '12 inch', price: 800 },
        ],
      },
    ],
  },
  {
    id: 'noodles',
    restaurantId: 'dapur',
    categoryId: 'noodles',
    name: 'Signature Mee Goreng',
    description:
      'Wok-tossed yellow noodles with prawns, tofu, vegetables, and a bright squeeze of lime.',
    price: 1690,
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    tags: ['Wok fresh'],
    dietary: 'none',
    available: true,
    optionGroups: [spice],
  },
  {
    id: 'cake',
    restaurantId: 'green',
    categoryId: 'desserts',
    name: 'Chocolate Hug',
    description:
      'Rich, fudgy chocolate cake with silky ganache. A little moment of happiness.',
    price: 1290,
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    tags: ['Sweet favourite'],
    dietary: 'vegetarian',
    available: true,
    optionGroups: [],
  },
  {
    id: 'salad',
    restaurantId: 'green',
    categoryId: 'healthy',
    name: 'Garden Crunch Salad',
    description:
      'Seasonal leaves, cherry tomatoes, cucumber, toasted seeds, and a zingy house vinaigrette.',
    price: 1990,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
    tags: ['Fresh daily'],
    dietary: 'vegetarian',
    available: true,
    optionGroups: [],
  },
  {
    id: 'satay',
    restaurantId: 'dapur',
    categoryId: 'local',
    name: 'Chicken Satay Plate',
    description:
      'Six flame-grilled chicken skewers with creamy peanut sauce, cucumber, and rice cakes.',
    price: 2190,
    image:
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    tags: ['For sharing'],
    dietary: 'none',
    available: true,
    optionGroups: [],
  },
];
