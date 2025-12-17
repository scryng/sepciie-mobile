// // src/services/api/modules/addresses.api.ts
// import api from "../client/apiClient";
// import type { ApiResponse } from "@/types/api"
// import { AddressRequest, AddressResponse, ObterLatLngRequest, ObterLatLngResponse, obterLatLngResponseSchema } from "@/types/api/addresses"

// export const addressesApi = {
//   getByCompany: async (
//     idCompany: number,
//     params?: { page?: number; pageSize?: number; search?: string; active?: boolean }
//   ): Promise<ApiResponse<AddressResponse>> =>
//     (await api.get(`/api/v2/Address/company/${idCompany}`, { params })).data,


//   obterLatLng: async (args: ObterLatLngRequest): Promise<ObterLatLngResponse> => {
//     const res = await api.post("/Rota/ObterLatLng", args);
//     const data = obterLatLngResponseSchema.parse(res.data);
//     return data;
//   },

//   create: async (address: AddressRequest): Promise<ApiResponse<AddressResponse>> => {
//     const geoLocationResponse = await addressesApi.obterLatLng({
//       bairro: address.neighborhood.trim(),
//       cep: address.zipCode.replaceAll("-", "").trim(),
//       cidade: address.city.trim(),
//       estado: address.state.trim(),
//       logradouro: address.street.trim(),
//       numero: address.number.trim(),
//     });

//     const requestBody = {
//       ...address,
//       latitude: geoLocationResponse.latitude,
//       longitude: geoLocationResponse.longitude,
//     } satisfies AddressRequest;

//     const data = (await api.post("/api/v2/Address", requestBody)).data
//     return data;
//   },

//   update: async (
//     id: number,
//     address: AddressRequest,
//   ): Promise<ApiResponse<AddressResponse>> => {
//     const geoLocationResponse = await addressesApi.obterLatLng({
//       bairro: address.neighborhood.trim(),
//       cep: address.zipCode.replaceAll("-", "").trim(),
//       cidade: address.city.trim(),
//       estado: address.state.trim(),
//       logradouro: address.street.trim(),
//       numero: address.number.trim(),
//     });

//     const requestBody = {
//       ...address,
//       latitude: geoLocationResponse.latitude,
//       longitude: geoLocationResponse.longitude,
//     } satisfies AddressRequest;

//     const data = (await api.put(`/api/v2/Address/${id}`, requestBody)).data;
//     return data;
//   },

//   toggleStatus: async (id: number): Promise<ApiResponse<AddressResponse>> =>
//     (await api.patch(`/api/v2/Address/${id}/status`)).data,

//   delete: async (id: number): Promise<ApiResponse<any>> =>
//     (await api.delete(`/api/v2/Address/${id}`)).data,
// };
