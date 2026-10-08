import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useServices } from '../../app/servicesContext';
import { CatalogContext, type CatalogState } from './catalogContext';
export function CatalogProvider({ children }: PropsWithChildren) {
  const { catalog } = useServices();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<Omit<CatalogState, 'retry'>>({
    data: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    const controller = new AbortController();
    catalog
      .getCatalog(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setState({
            data: null,
            loading: false,
            error:
              error instanceof Error ? error.message : 'Unable to load food.',
          });
      });
    return () => controller.abort();
  }, [catalog, attempt]);
  const retry = () => {
    setState({ data: null, loading: true, error: null });
    setAttempt((value) => value + 1);
  };
  return (
    <CatalogContext value={{ ...state, retry }}>{children}</CatalogContext>
  );
}
