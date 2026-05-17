'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

type DashboardSearchContextValue = {
  query: string;
  setQuery: (value: string) => void;
  clearQuery: () => void;
};

const DashboardSearchContext = createContext<DashboardSearchContextValue | null>(null);

export function DashboardSearchProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery('');
  }, [pathname]);

  const value = useMemo<DashboardSearchContextValue>(
    () => ({
      query,
      setQuery,
      clearQuery: () => setQuery(''),
    }),
    [query]
  );

  return <DashboardSearchContext.Provider value={value}>{children}</DashboardSearchContext.Provider>;
}

export function useDashboardSearch() {
  const context = useContext(DashboardSearchContext);
  if (!context) {
    throw new Error('useDashboardSearch must be used within DashboardSearchProvider');
  }
  return context;
}
