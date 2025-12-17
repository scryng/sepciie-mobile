import { stringify } from 'lossless-json';
import { ApiConfig } from './api-config';

export class BaseApi {
  urlApi = process.env.EXPO_PUBLIC_API_URL;

  protected async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const headers = await ApiConfig.getAuthHeaders();

    const response = await fetch(this.urlApi + url + queryString, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  protected async postJson<T>(url: string, model: any): Promise<T> {
    const headers = await ApiConfig.getAuthHeaders();

    const response = await fetch(this.urlApi + url, {
      method: 'POST',
      headers: headers,
      body: stringify(model),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  protected async postForm<T>(url: string, model: any): Promise<T> {
    const formdata = this.criarFormdData(model);
    const headers = await ApiConfig.getAuthHeadersForFormData();

    const response = await fetch(this.urlApi + url, {
      method: 'POST',
      headers: headers,
      body: formdata,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  protected criarFormdData(model: any): FormData {
    const formdata = new FormData();
    for (const key in model) {
      formdata.append(key, model[key] ?? '');
    }
    return formdata;
  }
}
