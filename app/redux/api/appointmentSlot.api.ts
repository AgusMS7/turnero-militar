import { AppointmentSlotFiltered } from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { headers } from "next/headers";
import { boolean } from "zod";

export const appointmentSlotApi = createApi({
  reducerPath: "appointmentSlot",
  tagTypes: ["AppointmentSlot"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    getAppointmenSlotsFiltered: builder.query<
      AppointmentSlotFiltered,
      {
        practitionerId?: string;
        allDays?: boolean;
        day?: string;
        page: number;
        limit: number;
        token: string;
      }
    >({
      query: ({ practitionerId, allDays, day, page, limit, token }) => ({
        url: "/appointment-slot/filtered",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          practitionerId: practitionerId,
          allDays: allDays,
          day: day,
          page: page,
          limit: limit,
        },
      }),
    }),
  }),
});

export const { useLazyGetAppointmenSlotsFilteredQuery } = appointmentSlotApi;