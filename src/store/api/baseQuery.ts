import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQueryOptions } from '@/utils/fetchBaseQueryOptions';
import { resolveBaseUrl } from '@/utils/resolveBaseUrl';
import { AuthenticationService } from '@/services/api/auth/authentication.api';
import { parse, stringify } from 'lossless-json';
import { isUppercase } from '@/utils/strings';
import { buildCookieHeader, clearCookieJar } from '@/utils/cookies';

async function isApiOnline(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/api/HealthCheck`);
    return res.status === 200;
  } catch {
    return false;
  }
}

function isBigIntField(key: string) {
  const bigIntFields = ['id', 'Id', 'onuIds'];

  if (bigIntFields.includes(key)) {
    return true;
  }

  const isIdPreffix = key.startsWith('id_') || key.endsWith('_id');
  const isIdSuffix = key.endsWith('Id') || key.endsWith('ID');
  const isCamelCasePrefix = (key.startsWith('id') || key.startsWith('Id')) && isUppercase(key.at(2));
  const isId = isIdPreffix || isIdSuffix || isCamelCasePrefix;

  return isId;
}

function jsonReceiver(key: string, value: any): any {
  if (value?.isLosslessNumber && isBigIntField(key)) {
    return BigInt(value.value);
  }

  if (value?.isLosslessNumber) {
    return Number.parseFloat(value.value);
  }

  return value;
}

export function parseWithBigInt(str: string): unknown {
  return parse(str, jsonReceiver);
}

function normalizeContentType(args: FetchArgs): string | undefined {
  if (typeof args.headers === 'object') {
    const headers = args.headers as Record<string, string>;
    return headers['Content-Type'];
  }

  if (typeof args.body === 'object') {
    return 'application/json';
  }

  return undefined;
}

function normalizeArgs(args: string | FetchArgs): FetchArgs {
  if (typeof args === 'string') {
    return { url: args };
  }

  const contentType = normalizeContentType(args);
  if (contentType === 'application/json') {
    return {
      ...args,
      body: stringify(args.body),
      headers: {
        ...args.headers,
        'Content-Type': contentType,
      },
    };
  }

  return { ...args };
}

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const state: any = api.getState?.() || {};
  const { currentEnvironment, appVariant } = state.environment || {};
  const baseUrl = resolveBaseUrl(currentEnvironment, appVariant);

  const token = await AuthenticationService.getToken();
  const cookie = await buildCookieHeader();

  const normalizedArgs = normalizeArgs(args);
  const headers = new Headers((normalizedArgs as any).headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (cookie) headers.set('Cookie', cookie);
  (normalizedArgs as any).headers = headers;

  const run = fetchBaseQuery({
    ...fetchBaseQueryOptions,
    baseUrl,
    responseHandler: async (response) => {
      const json = await response.text();
      const parsedData = parseWithBigInt(json);
      return parsedData;
    },
  });

  const result = await run(normalizedArgs, api, extraOptions);

  if ((result as any).error?.status === 'FETCH_ERROR') {
    if (await isApiOnline(baseUrl)) {
      await AuthenticationService.logout();
      await clearCookieJar();
    }
  }

  return result;
};
