import type { PropsWithChildren } from 'react';
import type { Services } from '../services/repositories/contracts';
import { createMockServices } from '../services/repositories/mock';
import { ServicesContext } from './servicesContext';
// Replace these adapters to connect a backend; hooks and UI remain unchanged.
const defaultServices = createMockServices();
export function ServicesProvider({
  children,
  services = defaultServices,
}: PropsWithChildren<{ services?: Services }>) {
  return <ServicesContext value={services}>{children}</ServicesContext>;
}
