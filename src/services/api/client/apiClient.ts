// src\services\api\client\apiClient.ts
import { clearCookieJar } from '@/utils/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { stringify as stringifyWithBigInt } from 'lossless-json';

import { resolveBaseUrl, Environment } from '@/utils/resolveBaseUrl';
import { store } from '@/store/store';
import { AuthenticationService } from '../auth/authentication.api';
import { loadingManager } from '@/utils/loadingManager';
import { parseWithBigInt } from '@/store/api/baseQuery';
import { parse } from 'zod/v4/core';

const isValidEnv = (v: any): v is Environment => v === 'production' || v === 'development' || v === 'local';

const getInitialEnv = (): Environment => {
  const v = process.env.EXPO_PUBLIC_DEFAULT_ENV;
  return isValidEnv(v) ? v : 'development';
};

const isAbsoluteURL = (url?: string) => !!url && /^(?:[a-z][a-z0-9+.+-]*:)?\/\//i.test(url);

const initialEnv = getInitialEnv();
const initialBaseUrl = resolveBaseUrl(initialEnv, process.env.EXPO_PUBLIC_APP_VARIANT);

const api = axios.create({
  baseURL: initialBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  transformResponse: (data, headers) => {
    try {
      // Only attempt to parse if the content type is JSON
      if (typeof data === 'string' && headers['content-type'] && headers['content-type'].includes('application/json')) {
        return parseWithBigInt(data);
      }
    } catch (e) {
      console.warn('Error parsing JSON with lossless-json:', e);
      // Fallback to default behavior or re-throw if strictness is required
    }
    return data;
  },
  transformRequest: (data, headers) => {
    try {
      if (data && typeof data === 'object' && headers['Content-Type'] === 'application/json') {
        // Use lossless-json's stringifier
        return stringifyWithBigInt(data);
      }
    } catch (e) {
      console.warn('Error stringifying JSON with lossless-json:', e);
      // Fallback to default behavior or re-throw if strictness is required
    }

    // Return the original data for other content types or if it's already a string/FormData
    return data;
  },
});

let lastBaseUrl: string | undefined;
(function subscribeBaseUrl() {
  try {
    store.subscribe(() => {
      const { apiUrl } = store.getState().environment || {};
      if (apiUrl && apiUrl !== lastBaseUrl) {
        api.defaults.baseURL = apiUrl;
        lastBaseUrl = apiUrl;
        console.log('[AXIOS] defaults.baseURL =>', apiUrl);
      }
    });
  } catch (e) {
    console.warn('Axios baseURL subscription skipped (store not ready yet):', e);
  }
})();

api.interceptors.request.use(
  async (config) => {
    loadingManager.start();

    try {
      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
        config.timeout = 30000;
      }

      const { apiUrl } = store.getState().environment || {};

      if (!isAbsoluteURL(config.url) && apiUrl) {
        config.baseURL = apiUrl;
        console.log('[AXIOS] request.baseURL =>', config.baseURL, 'url =>', config.url);
      }

      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      console.log(config.baseURL);
    } catch (err) {
      console.error('Axios request interceptor error:', err);
    }

    return config;
  },
  (error) => {
    loadingManager.stop();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('RETORNO DA API:');
    console.log(stringifyWithBigInt(response));

    loadingManager.stop();
    const responseUrl = (response.request as any)?.responseURL;
    if (typeof responseUrl === 'string') {
      const url = new URL(responseUrl);
      const method = (response.request as any)?._method;
      const isHtml = (response.request as any)?._response?.includes('<html');
      const isLoginPage = url.toString().endsWith('/Login');
      if (isHtml && method === 'GET' && isLoginPage) {
        AuthenticationService.logout();
        clearCookieJar();
      }
    }
    return response;
  },
  async (error) => {
    loadingManager.stop();
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('authToken');
      } catch (storageError) {
        console.error('Error removing auth token:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export function setApiBaseUrl(url: string) {
  api.defaults.baseURL = url;
  lastBaseUrl = url;
}

export default api;
