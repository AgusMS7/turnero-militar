import {
  SocialWork,
  SocialWorkGet,
  TokenWithEntity,
  TokenWithId,
} from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "inspector";

export const socialWorkApi = createApi({
  reducerPath: "socialWorkApi",
  tagTypes: ["SocialWork"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    getAllSocialWorks: builder.query<SocialWorkGet, string>({
      query: (token) => ({
        url: "/social-work?page=1&limit=100",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result) =>
        result
          ? result.socialWorks.map(({ id }) => ({ type: "SocialWork", id }))
          : ["SocialWork"],
    }),
    getOneSocialWork: builder.query<SocialWork, TokenWithId>({
      query: ({ id, token }) => ({
        url: `/social-work/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result, error, args) =>
        result ? [{ type: "SocialWork", id: args.id }] : [],
    }),
    createSocialWork: builder.mutation<SocialWork, TokenWithEntity>({
      query: ({ token, entity }) => ({
        url: "/social-work",
        method: "POST",
        body: entity,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["SocialWork"],
    }),
    updateSocialWork: builder.mutation<SocialWork, TokenWithEntity>({
      query: ({ token, entity }) => ({
        url: `/social-work/${entity.id}`,
        method: "PATCH",
        body: entity,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (result, error, args) => [
        { type: "SocialWork", id: args.entity.id },
      ],
    }),
    softDeleteSocialWork: builder.mutation<void, TokenWithId>({
      query: ({ id, token }) => ({
        url: `/social-work/soft-delete/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SocialWork", id },
        { type: "SocialWork", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllSocialWorksQuery,
  useGetOneSocialWorkQuery,
  useLazyGetAllSocialWorksQuery,
  useCreateSocialWorkMutation,
  useUpdateSocialWorkMutation,
  useSoftDeleteSocialWorkMutation,
} = socialWorkApi;
