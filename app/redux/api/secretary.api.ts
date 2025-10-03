import {
  GetSecretary,
  Secretary,
  TokenWithEntity,
  TokenWithId,
} from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const secretaryApi = createApi({
  reducerPath: "secretary",
  tagTypes: ["Secretary"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    getAllSecretaries: builder.query<GetSecretary, TokenWithEntity>({
      query: ({ token, entity }) => ({
        url: `secretary`,
        params: {
          page: entity.page,
          limit: entity.limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result) =>
        result
          ? result.secretaries.map(({ id }) => ({ type: "Secretary", id }))
          : [],
    }),
    getOneSecretary: builder.query<Secretary, TokenWithId>({
      query: ({ token, id }) => ({
        url: `secretary/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "Secretary", id: id }],
    }),
    createSecretary: builder.mutation<Secretary, TokenWithEntity>({
      query: ({ token, entity }) => ({
        url: `secretary`,
        method: "POST",
        body: entity,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    updateSecretary: builder.mutation<Secretary, TokenWithEntity>({
      query: ({ token, entity }) => ({
        url: `secretary/${entity.id}`,
        method: "PATCH",
        body: entity.body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (result, error, { entity }) => [
        { type: "Secretary", id: entity.id },
      ],
    }),
    deleteOneSecretary: builder.mutation<Secretary, TokenWithId>({
      query: ({ token, id }) => ({
        url: `secretary/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Secretary", id: id },
      ],
    }),
  }),
});

export const {
  useGetAllSecretariesQuery,
  useGetOneSecretaryQuery,
  useCreateSecretaryMutation,
  useUpdateSecretaryMutation,
  useDeleteOneSecretaryMutation,
} = secretaryApi;
