// src/types/api/path/ApiResponse.types.ts
import { PaginatedData } from './PaginatedData.types';

export interface ErrorDetail {
  field: string;
  issue: string;
}

export interface ApiError {
  code: string;
  message: string;
  details: ErrorDetail | ErrorDetail[];
}

export interface Meta {
  success: boolean;
  message: string;
  timestamp: string;
  apiVersion: string;
}

export interface ApiResponse<T> {
  data: T | T[] | PaginatedData<T> | null;
  meta: Meta;
  error?: ApiError;
}
