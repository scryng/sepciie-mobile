import { Company } from '@/types/common';
import api from '../client/apiClient';
import { ApiResponseV2 } from '@/types/api';
import { LoginRequest, LoginResponse } from '@/types/api/login';

export const usersApi = {
  create: async (data: Partial<Company>): Promise<ApiResponseV2<Company>> =>
    (await api.post('/api/v3/Companies', data)).data,

  login: async (data: LoginRequest): Promise<ApiResponseV2<LoginResponse>> =>
    (await api.post('/api/v2/Auth/login', data)).data,
};
