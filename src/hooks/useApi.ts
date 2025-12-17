import {
  useCheckLoginStatusQuery,
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useAuthPrefetch,
} from '@/store/api/api';

import { ApiResponse } from '@/types/api/path/ApiResponse.types';
import { AuthLoginRequest, AuthLoginResponse, AuthLoginUserData } from '@/types/api/auth';
import { useCallback, useMemo } from 'react';

export const useApi = () => {
  const {
    data: isLoggedIn = false,
    isLoading: isCheckingLogin,
    refetch: refetchLoginStatus,
  } = useCheckLoginStatusQuery();

  const {
    data: currentUser,
    isLoading: isLoadingUser,
    refetch: refetchCurrentUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !isLoggedIn,
  });

  const getCurrentUserPrefetch = useAuthPrefetch('getCurrentUser');

  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const login = useCallback(
    async (payload: AuthLoginRequest): Promise<ApiResponse<AuthLoginResponse>> => {
      try {
        const res = await loginMutation(payload).unwrap();

        // Sucesso: meta.success === true
        if (res.meta?.success) {
          // Força recarregar usuário e status
          getCurrentUserPrefetch(undefined, { force: true });
          await refetchLoginStatus();
          return res;
        }

        // Erro controlado pela API
        const msg = res.error?.message || 'Credenciais inválidas';
        throw new Error(msg);
      } catch (error: any) {
        // Erro de rede ou unwrap
        throw new Error(error.message || 'Erro ao fazer login');
      }
    },
    [loginMutation, getCurrentUserPrefetch, refetchLoginStatus]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutMutation().unwrap();
    } finally {
      await Promise.all([refetchLoginStatus(), refetchCurrentUser()]);
    }
  }, [logoutMutation, refetchLoginStatus, refetchCurrentUser]);

  const refresh = useCallback(async () => {
    await Promise.all([refetchLoginStatus(), refetchCurrentUser()]);
  }, [refetchLoginStatus, refetchCurrentUser]);

  const isAuthenticated = useMemo(() => Boolean(isLoggedIn && currentUser), [isLoggedIn, currentUser]);

  const isLoading = useMemo(
    () => isCheckingLogin || (isLoggedIn && isLoadingUser) || isLoggingIn || isLoggingOut,
    [isCheckingLogin, isLoggedIn, isLoadingUser, isLoggingIn, isLoggingOut]
  );

  return {
    isAuthenticated,
    isLoading,
    isCheckingAuth: isCheckingLogin,
    isLoggingIn,
    isLoggingOut,
    currentUser: currentUser as AuthLoginUserData | null,
    login,
    logout,
    refresh,
  };
};
