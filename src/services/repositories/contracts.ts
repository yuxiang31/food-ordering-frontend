import type { Catalog, OrderDraft, OrderReceipt, User } from '../../models';
export interface CatalogRepository {
  getCatalog(signal?: AbortSignal): Promise<Catalog>;
}
export interface OrderRepository {
  submit(draft: OrderDraft, signal?: AbortSignal): Promise<OrderReceipt>;
}
export interface AuthRepository {
  getCurrentUser(): Promise<User | null>;
  login(): Promise<void>;
  logout(): Promise<void>;
}
export interface Services {
  catalog: CatalogRepository;
  orders: OrderRepository;
  auth: AuthRepository;
}
export class ServiceError extends Error {
  readonly code: 'unavailable' | 'validation' | 'unsupported';
  constructor(
    message: string,
    code: 'unavailable' | 'validation' | 'unsupported',
  ) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
  }
}
