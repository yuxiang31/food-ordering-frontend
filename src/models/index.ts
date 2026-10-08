export type Money = number; // Integer sen. API prices must be validated by the server.
export type Fulfillment = 'delivery' | 'pickup';
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryMinutes: string;
  deliveryFee: Money;
  tags: string[];
  address: string;
}
export interface Category {
  id: string;
  name: string;
  symbol: string;
}
export interface FoodOption {
  id: string;
  label: string;
  price: Money;
}
export interface OptionGroup {
  id: string;
  name: string;
  required: boolean;
  options: FoodOption[];
}
export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: Money;
  image: string;
  rating: number;
  tags: string[];
  dietary: 'vegetarian' | 'none';
  available: boolean;
  optionGroups: OptionGroup[];
}
export interface Catalog {
  restaurants: Restaurant[];
  categories: Category[];
  menuItems: MenuItem[];
}
export interface CartItem {
  key: string;
  menuItemId: string;
  restaurantId: string;
  quantity: number;
  optionIds: string[];
}
export interface Cart {
  items: CartItem[];
}
export interface ResolvedCartItem extends CartItem {
  menuItem: MenuItem;
  options: FoodOption[];
  unitPrice: Money;
  lineTotal: Money;
}
export interface CartGroup {
  restaurant: Restaurant;
  items: ResolvedCartItem[];
  subtotal: Money;
  deliveryFee: Money;
  total: Money;
}
export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}
export interface GuestDetails {
  name: string;
  phone: string;
  address: string;
  notes: string;
}
export interface OrderDraft {
  groups: CartGroup[];
  fulfillment: Fulfillment;
  guest: GuestDetails;
}
export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: ResolvedCartItem[];
  subtotal: Money;
  deliveryFee: Money;
  total: Money;
  status: 'demo-confirmed';
}
export interface OrderReceipt {
  id: string;
  orders: Order[];
  fulfillment: Fulfillment;
  createdAt: string;
  total: Money;
}
