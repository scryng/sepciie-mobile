// src/store/api/mainApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery,
  tagTypes: ['User', 'Department', 'Type', 'Level', 'Communication'],
  endpoints: (builder) => ({
    // Users
    getUsers: builder.query<any[], void>({ query: () => '/api/users', providesTags: ['User'] }),
    getUser: builder.query<any, string>({ query: (id) => `/api/users/${id}`, providesTags: ['User'] }),
    createUser: builder.mutation<any, any>({
      query: (body) => ({ url: '/api/users', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/api/users/${id}`, method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),

    // Departments
    getDepartments: builder.query<any[], void>({ query: () => '/api/departments', providesTags: ['Department'] }),
    createDepartment: builder.mutation<any, any>({
      query: (body) => ({ url: '/api/departments', method: 'POST', body }),
      invalidatesTags: ['Department'],
    }),
    updateDepartment: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/api/departments/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Department'],
    }),
    deleteDepartment: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/departments/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Department'],
    }),

    // Types
    getTypes: builder.query<any[], void>({ query: () => '/api/types', providesTags: ['Type'] }),
    createType: builder.mutation<any, any>({
      query: (body) => ({ url: '/api/types', method: 'POST', body }),
      invalidatesTags: ['Type'],
    }),
    updateType: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/api/types/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Type'],
    }),
    deleteType: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/types/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Type'],
    }),

    // Levels
    getLevels: builder.query<any[], void>({ query: () => '/api/levels', providesTags: ['Level'] }),
    createLevel: builder.mutation<any, any>({
      query: (body) => ({ url: '/api/levels', method: 'POST', body }),
      invalidatesTags: ['Level'],
    }),
    updateLevel: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/api/levels/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Level'],
    }),
    deleteLevel: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/levels/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Level'],
    }),

    // Communications
    getCommunications: builder.query<any[], void>({
      query: () => '/api/communications',
      providesTags: ['Communication'],
    }),
    createCommunication: builder.mutation<any, any>({
      query: (body) => ({ url: '/api/communications', method: 'POST', body }),
      invalidatesTags: ['Communication'],
    }),
    updateCommunication: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/api/communications/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Communication'],
    }),
    deleteCommunication: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/communications/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Communication'],
    }),

    // User-Department
    assignUserToDepartment: builder.mutation<void, { userId: string; departmentId: string }>({
      query: (body) => ({ url: '/api/users-departments', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
    removeUserFromDepartment: builder.mutation<void, { userId: string; departmentId: string }>({
      query: ({ userId, departmentId }) => ({
        url: '/api/users-departments',
        method: 'DELETE',
        body: { userId, departmentId },
      }),
      invalidatesTags: ['User'],
    }),
    getDepartmentsByUser: builder.query<any[], string>({
      query: (userId) => `/api/users-departments/user/${userId}`,
      providesTags: ['User'],
    }),

    // Communication-User
    markCommunicationAsRead: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/communication-users/${id}/read`, method: 'PATCH' }),
      invalidatesTags: ['Communication'],
    }),
    getCommunicationsByUser: builder.query<any[], string>({
      query: (userId) => `/api/communication-users/user/${userId}`,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,

  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,

  useGetTypesQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation,

  useGetLevelsQuery,
  useCreateLevelMutation,
  useUpdateLevelMutation,
  useDeleteLevelMutation,

  useGetCommunicationsQuery,
  useCreateCommunicationMutation,
  useUpdateCommunicationMutation,
  useDeleteCommunicationMutation,

  useAssignUserToDepartmentMutation,
  useRemoveUserFromDepartmentMutation,
  useGetDepartmentsByUserQuery,
  useMarkCommunicationAsReadMutation,
} = mainApi;
