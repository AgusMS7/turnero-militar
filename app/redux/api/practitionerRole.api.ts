import { PractitionerRole } from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const practitionerRoleAPI = createApi({
  reducerPath: "practitionerRoles",
  tagTypes: ["PractitionerRoles"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    getAllPractitionerRoles: builder.query<PractitionerRole[], void>({
      query: () => "/practitioner-role",
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "PractitionerRoles", id }))
          : ["PractitionerRoles"],
    }),
    getAllPractitionerRolesIncludingDelete: builder.query<
      PractitionerRole[],
      void
    >({
      query: () => "/practitioner-role/including-deleted",
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "PractitionerRoles", id }))
          : [],
    }),
    getOnePractitionerRole: builder.query<PractitionerRole, string | number>({
      query: (id) => `/practitioner-role/${id}`,
      providesTags: (result, error, id) =>
        result ? [{ type: "PractitionerRoles", id }] : [],
    }),
    createPractitionerRole: builder.mutation<
      PractitionerRole,
      Partial<PractitionerRole>
    >({
      query: (body) => ({
        url: "/practitioner-role",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PractitionerRoles"],
    }),
    updatePractitionerRole: builder.mutation<
      PractitionerRole,
      Partial<PractitionerRole>
    >({
      query: (body) => ({
        url: `/practitioner-role/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "PractitionerRoles", id: args.id },
      ],
    }),
    updatePractitionerRoleRecover: builder.mutation<
      PractitionerRole,
      Partial<PractitionerRole>
    >({
      query: (body) => ({
        url: `/practitioner-role/recover/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "PractitionerRoles", id: args.id },
      ],
    }),
    updatePractitionerRoleRestore: builder.mutation<
      PractitionerRole,
      Partial<PractitionerRole>
    >({
      query: (body) => ({
        url: `/practitioner-role/restore/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "PractitionerRoles", id: args.id },
      ],
    }),
    deletePractitionerRole: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/practitioner-role/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "PractitionerRoles", id: args },
      ],
    }),
    deletePractitionerRoleSoftDelete: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/practitioner-role/soft-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "PractitionerRoles", id: args },
      ],
    }),
  }),
});
export const {
  useGetAllPractitionerRolesQuery,
  useGetOnePractitionerRoleQuery,
  useGetAllPractitionerRolesIncludingDeleteQuery,
  useCreatePractitionerRoleMutation,
  useUpdatePractitionerRoleMutation,
  useUpdatePractitionerRoleRecoverMutation,
  useUpdatePractitionerRoleRestoreMutation,
  useDeletePractitionerRoleMutation,
  useDeletePractitionerRoleSoftDeleteMutation,
} = practitionerRoleAPI;
