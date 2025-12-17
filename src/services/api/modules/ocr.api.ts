import api from "../client/apiClient";

export const ocrApi = {

  validateCnpjCard: async (formData: FormData): Promise<any> => {
    try {
      const file = formData.get("file") as File;
      if (!file) {
        throw new Error("Nenhum arquivo fornecido no FormData");
      }

      const correctedFormData = new FormData();
      correctedFormData.append("file", file, file.name);

      const response = await api.post("/ocr/cnpj", correctedFormData);
      const { data } = response;

      if (data.success && data.success.length > 0) {
        return data;
      } else if (data.failed && data.failed.length > 0) {
        throw new Error(data.failed[0].error || "Falha no processamento do documento");
      } else {
        throw new Error("Resposta inesperada da API OCR");
      }
    } catch (error: any) {
      console.error("[DEBUG] OCR validation error (CNPJ):", error);
      throw error;
    }
  },

  validateCnh: async (formData: FormData): Promise<any> => {
    try {
      const file = formData.get("file") as File;
      if (!file) {
        throw new Error("Nenhum arquivo fornecido no FormData");
      }

      const correctedFormData = new FormData();
      correctedFormData.append("file", file, file.name);

      const response = await api.post("/ocr/cnh", correctedFormData);
      const { data } = response;

      if (data.success && data.success.length > 0) {
        return data;
      } else if (data.failed && data.failed.length > 0) {
        throw new Error(data.failed[0].error || "Falha no processamento do documento");
      } else {
        throw new Error("Resposta inesperada da API OCR");
      }
    } catch (error: any) {
      console.error("[DEBUG] OCR validation error (CNPJ):", error);
      throw error;
    }
  },

  validateCcee: async (formData: FormData): Promise<any> => {
    try {
      const file = formData.get("file") as File;
      if (!file) {
        throw new Error("Nenhum arquivo fornecido no FormData");
      }

      const correctedFormData = new FormData();
      correctedFormData.append("file", file, file.name);

      const response = await api.post("/ocr/contract/emergency", correctedFormData);
      const { data } = response;

      if (data.success && data.success.length > 0) {
        return data;
      } else if (data.failed && data.failed.length > 0) {
        throw new Error(data.failed[0].error || "Falha no processamento do documento");
      } else {
        throw new Error("Resposta inesperada da API OCR");
      }
    } catch (error: any) {
      console.error("[DEBUG] OCR validation error (CCEE):", error);
      throw error;
    }
  },
};
