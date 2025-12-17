// src/types/api/path/PaginatedData.types.ts
export interface PaginatedData<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
}
