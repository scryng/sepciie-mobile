export const fetchBaseQueryOptions = {
  meta: true as const,

  prepareHeaders: (headers: Headers, { endpoint }: any) => {
    headers.set('Accept', '*/*');
    if (endpoint === 'LoginAplicativo') {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  },
};
