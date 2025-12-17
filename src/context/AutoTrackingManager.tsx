import { useApi } from '@/hooks/useApi';
import { LogService } from '@/services/logging/LogService';
import React, { useEffect, useRef } from 'react';

export const AutoTrackingManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, currentUser } = useApi();
  const hasStartedTracking = useRef(false);

  useEffect(() => {
    const handleAuthChange = async () => {
      const isTracking = false;

      if (isAuthenticated && currentUser) {
        try {
          LogService.info('User authenticated, starting automatic tracking', {
            userId: 1,
            userName: 'Teste',
          });

          hasStartedTracking.current = true;
          LogService.info('Automatic tracking started successfully');
        } catch (error) {
          LogService.error('Error starting automatic tracking', error);
        }
      } else if (!isAuthenticated && isTracking) {
        LogService.info('User logged out, stopping tracking');
        hasStartedTracking.current = false;
      }
    };

    handleAuthChange();
  }, [isAuthenticated, currentUser]);

  return <>{children}</>;
};
