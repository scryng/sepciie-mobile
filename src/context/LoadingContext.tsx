import React, { createContext, useContext, useState } from 'react';
import { registerLoadingHandlers } from '@/utils/loadingManager';

const LoadingContext = createContext({
  isLoading: false,
  increment: () => {},
  decrement: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const increment = () => setLoadingCount((prev) => prev + 1);
  const decrement = () => setLoadingCount((prev) => Math.max(prev - 1, 0));

  registerLoadingHandlers(increment, decrement);

  return (
    <LoadingContext.Provider value={{ isLoading: loadingCount > 0, increment, decrement }}>
      {children}
    </LoadingContext.Provider>
  );
};
