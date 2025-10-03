import { TokenWithEntity } from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authenticationApi = createApi({
  reducerPath: "authenticationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<void, string>({
      query: (email) => ({
        url: `/auth/forgot-password?email=${email}`,
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation<void, TokenWithEntity>({
      query: (args) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body:args.entity,
        headers: {
          Authorization: `Bearer ${args.token}`,
        },
      }),
    }),
    changePassword: builder.mutation<void, TokenWithEntity>({
      query: (args) => ({
        url: `/auth/change-password`,
        method: "PATCH",
        body:args.entity,
        headers: {
          Authorization: `Bearer ${args.token}`,
        },
      }),
    }),
    uploadImage: builder.mutation<{url:string}, TokenWithEntity>({
      query: (args) => ({
        url: `/auth/upload`,
        method: "POST",
        body:args.entity,
        headers: {
          Authorization: `Bearer ${args.token}`,
        },
      }),
    })
  }),
});

export const { useForgotPasswordMutation, useResetPasswordMutation, useChangePasswordMutation, useUploadImageMutation } =

  authenticationApi;
