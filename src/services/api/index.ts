// src/services/api/index.ts
import { usersApi } from "./modules/users.api";
import { companiesApi } from "./modules/companies.api";
// import { addressesApi } from "./modules/addresses.api";
import { documentsApi } from "./modules/documents.api";
import { ocrApi } from "./modules/ocr.api";
import { brasilApi } from "./modules/brasilApi";

export const api = {
  users: usersApi,
  companies: companiesApi,
  // addresses: addressesApi,
  documents: documentsApi,
  ocr: ocrApi
};

export const brasil = brasilApi;