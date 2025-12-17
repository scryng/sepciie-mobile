import { usePageAccess } from '@/hooks/usePageAccess';
import { PageKey } from '@/services/models/types/access';

interface CheckPermissionsOptions {
  /** Se deve habilitar polling automático para todas as páginas */
  enablePolling?: boolean;
  /** Intervalo do polling em ms */
  pollingInterval?: number;
}

export function checkPermissions(
  pagesToCheck: PageKey[],
  options: CheckPermissionsOptions = {}
) {
  const { enablePolling = false, pollingInterval = 30000 } = options;

  const permissions = pagesToCheck.map((page) =>
    usePageAccess(page, { enablePolling, pollingInterval })
  );

  const allPermissionsLoaded = permissions.every(
    (permission) => !permission.isLoading
  );

  const allCanView = permissions.every((permission) => permission.canView);

  const hasAnyPermission = permissions.some((permission) => permission.canView);

  // Função para forçar refetch de todas as permissões
  const refetchAll = () => {
    permissions.forEach((permission) => {
      if (permission.refetch) {
        permission.refetch();
      }
    });
  };

  return {
    allPermissionsLoaded,
    allCanView,
    hasAnyPermission,
    permissions,
    refetchAll,
  };
}
