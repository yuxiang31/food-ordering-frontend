import { createContext, useContext } from 'react';
import type { Services } from '../services/repositories/contracts';
export const ServicesContext = createContext<Services | null>(null);
export function useServices() {
  const services = useContext(ServicesContext);
  if (!services) throw new Error('ServicesProvider is required');
  return services;
}
