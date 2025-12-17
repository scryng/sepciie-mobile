// src/services/api/modules/documents.api.ts
import api from '../client/apiClient';
import type { ApiResponse } from '@/types/api';
import { MandatoryDocumentResponse } from '@/types/api/documents';
import { DocumentRequest } from '@/types/api/documents/Request.types';

export const documentsApi = {
  getMandatoryDocumentsForCompanyRegistration: async (
    page: string
  ): Promise<ApiResponse<MandatoryDocumentResponse[]>> =>
    (await api.get(`/api/v2/MandatoryDocument/page/${page}`)).data,

  create: async (document: DocumentRequest, url: string): Promise<ApiResponse<MandatoryDocumentResponse>> =>
    (await api.post(url, document)).data,
};
