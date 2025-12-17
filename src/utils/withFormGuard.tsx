// utils/withFormGuard.tsx
import FormRouteGuard from '@/components/layout/FormRouteGuard';
import { PageKey } from '@/services/models/types/access';
import React from 'react';

/**
 * HOC específico para páginas de formulário que não faz refresh automático
 * para evitar reset dos formulários durante preenchimento
 */
export function withFormGuard<P>(
  Component: React.ComponentType<any>,
  page: PageKey
) {
  const Guarded: React.FC<P> = (props) => (
    <FormRouteGuard page={page}>
      <Component {...props} />
    </FormRouteGuard>
  );

  return Guarded;
}
