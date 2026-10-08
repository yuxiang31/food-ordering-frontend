import { createContext, useContext } from 'react';
import type { Catalog } from '../../models';
export type CatalogState = {
  data: Catalog | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
};
export const CatalogContext = createContext<CatalogState | null>(null);
export function useCatalog() {
  const state = useContext(CatalogContext);
  if (!state) throw new Error('CatalogProvider is required');
  return state;
}
