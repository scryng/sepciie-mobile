// withGuard.tsx



import RouteGuard from '@/components/layout/RouteGuard';
import { PageKey } from '@/services/models/types/access';
import React from 'react';

export function withGuard<P>(
  Component: React.ComponentType<any>,
  page: PageKey
) {
  const Guarded: React.FC<P> = (props) => (
    <RouteGuard page={page}>
      <Component {...props} />
    </RouteGuard>
  );

  return Guarded;
}
