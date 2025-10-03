import {
  PractitionerSocialWork,
  PractitionerSocialWorkGet,
  TokenWithEntity,
  TokenWithId,
} from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const practitionerSocialWorkAPI = createApi({
  reducerPath: "practitionerSocialWorkApi",
  tagTypes: ["PractitionerSocialWork"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    getAllPractitionerSocialWorks: builder.query<
      PractitionerSocialWorkGet,
      TokenWithId
    >({
      query: (args) => ({
        url: `/practitioner-social-work?practitionerId=${args.id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${args.token}`,
        },
      }),
      providesTags: (result) =>
        result
          ? result.data.map(({ id }) => ({
              type: "PractitionerSocialWork",
              id,
            }))
          : [],
    }),
    getOnePractitionerSocialWork: builder.query<
      PractitionerSocialWork,
      string | number
    >({
      query: (id) => `/practitioner-social-work/${id}`,
      providesTags: (result, error, id) =>
        result ? [{ type: "PractitionerSocialWork", id }] : [],
    }),
    createPractitionerSocialWork: builder.mutation<
      PractitionerSocialWork,
      TokenWithEntity
    >({
      query: (args) => ({
        url: "/practitioner-social-work",
        method: "POST",
        headers: {
          Authorization: `Bearer ${args.token}`,
        },
        body: args.entity,
      }),
      invalidatesTags: ["PractitionerSocialWork"],
    }),
    updatePractitionerSocialWork: builder.mutation<
      PractitionerSocialWork,
      TokenWithEntity
    >({
      query: (args) => ({
        url: `/practitioner-social-work/${args.entity.id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${args.token}`,
        },
        body: { price: args.entity.price },
      }),
      invalidatesTags: (result, error, args) => [
        { type: "PractitionerSocialWork", id: args.entity.id },
      ],
    }),
    deletePractitionerSocialWork: builder.mutation<void, TokenWithId>({
      query: (args) => ({
        url: `/practitioner-social-work/soft-delete/${args.id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${args.token}`,
        },
      }),
      invalidatesTags: (result, error, args) => [
        { type: "PractitionerSocialWork", id: args.id },
      ],
    }),
  }),
});

export const {
  useLazyGetAllPractitionerSocialWorksQuery,
  useGetOnePractitionerSocialWorkQuery,
  useCreatePractitionerSocialWorkMutation,
  useUpdatePractitionerSocialWorkMutation,
  useDeletePractitionerSocialWorkMutation,
} = practitionerSocialWorkAPI;
