import { PractitionerAppointment, TokenWithId } from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const practitionerAppointmentAPI = createApi({
  reducerPath: "practitionerAppointment",
  tagTypes: ["PractitionerAppointment"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    getPractitionerAppointment: builder.query<
      PractitionerAppointment[],
      TokenWithId
    >({
      query: ({id, token}) => ({
        url: `/practitioner-appointment/practitioner/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }),
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "PractitionerAppointment", id }))
          : [],
    }),
  }),
});

export const { useLazyGetPractitionerAppointmentQuery } =
  practitionerAppointmentAPI;
