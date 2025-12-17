// src/services/api/modules/companies.api.ts
import api from '../client/apiClient';
import type { ApiResponse, CategoryResponse, EmergencyResponse } from '@/types/api';
import { CompanyRequest, CompanyResponse } from '@/types/api/companies';
import { ExistingDocument } from '@/types/common';

export const companiesApi = {
  get: async (
    idLogin: bigint,
    params?: { page?: number; pageSize?: number; search?: string; active?: boolean }
  ): Promise<ApiResponse<CompanyResponse>> =>
    (await api.get(`/ajax/v2/companies/login/${idLogin.toString()}`, { params })).data,

  getCategories: async (): Promise<ApiResponse<CategoryResponse>> =>
    (await api.get(`/ajax/v2/companies/categories/read-only`)).data,

  getEmergency: async (): Promise<ApiResponse<EmergencyResponse>> =>
    (await api.get(`/ajax/v2/companies/emergency`)).data,

  getById: async (id: bigint): Promise<ApiResponse<CompanyResponse>> =>
    (await api.get(`/ajax/v2/companies/${id}`)).data,

  create: async (company: CompanyRequest): Promise<ApiResponse<CompanyResponse>> =>
    (await api.post('/ajax/v2/companies', company)).data,

  update: async (id: bigint, company: CompanyRequest): Promise<ApiResponse<CompanyResponse>> =>
    (await api.put(`/ajax/v2/companies/${id}`, company)).data,

  toggleStatus: async (id: bigint): Promise<ApiResponse<CompanyResponse>> =>
    (await api.patch(`/ajax/v2/companies/${id}/status`)).data,

  delete: async (id: bigint): Promise<{ success: boolean; message: string }> =>
    (await api.delete(`/ajax/v2/companies/${id}`)).data,

  getDocuments: async (id: bigint):  Promise<ApiResponse<ExistingDocument>> => 
    (await api.get(`/api/v2/Documents/company/${id}`)).data,

  deleteDocument: async (docId: number | string ): Promise<{ success: boolean; message: string }> =>
    (await api.delete(`api/v2/Documents/${docId}`)).data,
}