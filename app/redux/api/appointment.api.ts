import {
  AppointentTypeStats,
  Appointment,
  AppointmentGet,
  TokenWithEntity,
  AppointmentStats,
  AppointmentCompleted,
  Schedule,
  SocialWorkStats,
  TopPatientStat,
  HorariosId,
  TokenWithId,
  ScheduleDays,
} from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appointmentAPI = createApi({
  reducerPath: "appointments",
  tagTypes: ["Appointments"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    getAllAppointments: builder.query<AppointmentGet, void>({
      query: () => "/appointment",
      providesTags: (result) =>
        result
          ? result.turns.map(({ id }) => ({ type: "Appointments", id }))
          : [],
    }),
    getAllAppointmentsWithFilters: builder.query<AppointmentGet, {
        token: string,
        patientName?: string,
        practitionerName?: string,
        status?: string,
        startDate?: string,
        endDate?: string,
        page?: string,
        limit?: string,
      }>({
      query: ({token, patientName,practitionerName, status, startDate, endDate, page, limit }) => ({
        url:"/appointment",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          patientName,
          practitionerName,
          status,
          startDate,
          endDate,
          page,
          limit,
        }
      }),
      providesTags: (result) =>
        result
          ? result.turns.map(({ id }) => ({ type: "Appointments", id }))
          : [],
    }),
    getAllAppointmentsIncludedDeleted: builder.query<AppointmentGet, void>({
      query: () => "/appointment/including-delete",
      providesTags: (result) =>
        result
          ? result.turns.map(({ id }) => ({ type: "Appointments", id }))
          : [],
    }),
    getAllAppointmentsBySpecificDay: builder.query<
      AppointmentGet,
      TokenWithEntity
    >({
      query: ({ token, entity }) => ({
        url: `/appointment?startDate=${entity.date}&endDate=${entity.date}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result) =>
        result
          ? result.turns.map(({ id }) => ({ type: "Appointments", id }))
          : [],
    }),
    getOneAppointment: builder.query<Appointment, string | number>({
      query: (id) => `/appointment/${id}`,
      providesTags: (result, error, id) =>
        result ? [{ type: "Appointments", id }] : [],
    }),
    getAppointmentsBySpecialist: builder.query<Appointment[], TokenWithId>({
      query: ({ id, token }) => ({
        url: `/appointment/specialist/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result) =>
        result ? result.map(({ id }) => ({ type: "Appointments", id })) : [],
    }),
    getAllAppointmentsBySpecialist: builder.query<
      AppointmentGet,
      string | number
    >({
      query: (id) => `/appointment/specialist-all/${id}`,
      providesTags: (result) =>
        result
          ? result.turns.map(({ id }) => ({ type: "Appointments", id }))
          : [],
    }),
    getAppointmentsByPatient: builder.query<AppointmentGet, TokenWithEntity>({
      query: ({ entity, token }) => ({
        url: `/appointment/patient/${entity.id}?page=${entity.page}&limit=${entity.limit}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result) =>
        result
          ? result.turns.map(({ id }) => ({ type: "Appointments", id }))
          : [],
    }),
    getAppointmentsByPatientAndPractitioner: builder.query<
      Appointment[],
      { patientId: string; practitionerId: string }
    >({
      query: ({ patientId, practitionerId }) =>
        `/appointment/patient/${patientId}/practitioner/${practitionerId}`,
      providesTags: (result) =>
        result ? result.map(({ id }) => ({ type: "Appointments", id })) : [],
    }),
    getAllAppointmentsByPatient: builder.query<
      AppointmentGet,
      {
        id: string | null;
        token: string;
        practitionerName?: string;
        status?: string;
        profession?: string;
        startDate?: string;
        endDate?: string;
        page?: string;
        limit?: string;
      }
    >({
      query: ({
        id,
        token,
        practitionerName,
        status,
        profession,
        startDate,
        endDate,
        page,
        limit,
      }) => ({
        url: `/appointment/patient-all/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          practitionerName,
          status,
          profession,
          startDate,
          endDate,
          page,
          limit,
        },
      }),
      providesTags: (result) =>
        result
          ? result.turns.map(({ id }) => ({ type: "Appointments", id }))
          : [],
    }),
    getAllAppointmentsByPractitioner: builder.query<
      AppointmentGet,
      {
        id: string | null;
        token: string;
        patientName?: string;
        status?: string;
        patientDNI?: string;
        startDate?: string;
        endDate?: string;
        page?: string;
        limit?: string;
      }
    >({
      query: ({
        id,
        token,
        patientName,
        status,
        patientDNI,
        startDate,
        endDate,
        page,
        limit,
      }) => ({
        url: `/appointment/practitioner/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          patientName,
          status,
          patientDNI,
          startDate,
          endDate,
          page,
          limit,
        },
      }),
      providesTags: (result) =>
        result
          ? result.turns.map(({ id }) => ({ type: "Appointments", id }))
          : [],
    }),
    getAppointmentStatsByPractitioner: builder.query<
      AppointmentStats,
      TokenWithEntity
    >({
      query: ({token,entity}) => ({
        url: `/appointment/stats/${entity.id}`,
        params: { period: entity.period },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getAppointmentStatsAllPractitioner: builder.query<
      AppointmentStats,
      TokenWithEntity
    >({
      query: ({ entity, token }) => ({
        url: "/appointment/stats",
        params: {
          period: entity.period
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getAppointmentCompletedByPractitioner: builder.query<
      AppointmentCompleted,
      TokenWithEntity
    >({
      query: ({ entity, token }) => ({
        url: `/appointment/completed/practitioner/${entity.id}`,
        params: {
          period: entity.period,
          page: entity.page,
          limit: entity.limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getAppointmentCompletedAllPractitioner: builder.query<
      AppointmentCompleted,
      [string, string]
    >({
      query: ([period, token]) => ({
        url: "/appointment/completed/all",
        params: { period },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getTypeAppointentStatsByPractitioner: builder.query<
      AppointentTypeStats,
      TokenWithEntity
    >({
      query: ({ token, entity }) => ({
        url: `/appointment/type-stats/${entity.id}?startDate=${entity.startDate}&endDate=${entity.endDate}`, //Los periodos enviados pueden ser week, month o year
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getAllSocialWorkStats: builder.query<SocialWorkStats, TokenWithEntity>(
      {
        query: ({token,entity}) => ({
          url: `/appointment/social-work-stats`,
          params:{
            startDate:entity.startDate,
            endDate:entity.endDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        providesTags: ["Appointments"]
      }
    ),
    getSocialWorkStatsByPractitionerId: builder.query<SocialWorkStats, TokenWithEntity>(
      {
        query: ({ entity, token }) => ({
          url: `/appointment/social-work-stats/${entity.id}`,
          params:{
            startDate:entity.startDate,
            endDate:entity.endDate
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        providesTags: ["Appointments"]
      }
    ),
    getTopPatientStats: builder.query<TopPatientStat[], TokenWithEntity>(
      {
        query: ({ entity, token }) => ({
          url: `/appointment/top-patients/stats`,
          params: {
            startDate: entity.startDate,
            endDate: entity.endDate,
            limit: entity.limit,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        providesTags: ["Appointments"]
      }
    ),
    getTopPatientStatsByPractitioner: builder.query<TopPatientStat[], TokenWithEntity>(
      {
        query: ({ entity, token }) => ({
          url: `/appointment/top-patients/stats/${entity.id}`,
          params: {
            startDate: entity.startDate,
            endDate: entity.endDate,
            limit: entity.limit,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        providesTags: ["Appointments"]
      }
    ),
    createAppointment: builder.mutation<Appointment, { appointment: Partial<Appointment>, token: string }>({
      query: ({ appointment, token }) => ({
        url: "/appointment",
        method: "POST",
        body: appointment,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Appointments"],
    }),
    updateAppointment: builder.mutation<Appointment, Partial<Appointment>>({
      query: ({ id, ...rest }) => ({
        url: `/appointment/${id}`,
        method: "PATCH",
        body: rest,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args.id },
      ],
    }),
    cancelAppointment: builder.mutation<string, string | number>({
      query: (id) => ({
        url: `/appointment/cancel/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args },
      ],
    }),
    reprogramAppointment: builder.mutation<Appointment, Partial<Appointment>>({
      query: (body) => {
        const { id, ...reprogramData } = body;
        return {
          url: `/appointment/reprogram/${id}`,
          method: "PATCH",
          body: reprogramData,
        };
      },
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args.id },
      ],
    }),
    checkOverlap: builder.mutation<Appointment, Partial<Appointment>>({
      query: (body) => ({
        url: `/appointment/check-overlap/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args.id },
      ],
    }),
    updateAppointmentStatus: builder.mutation<
      Appointment,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/appointment/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args.id },
      ],
    }),
    getScheduleId: builder.query<
      HorariosId,
      { practitionerId: string; date: string; hour: string; token: string }
    >({
      query: ({ practitionerId, date, hour, token }) => ({
        url: `/appointment/schedule-slot/practitioner/${practitionerId}`,
        params: { date, hour },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    recoverAppointment: builder.mutation<Appointment, string | number>({
      query: (id) => ({
        url: `/appointment/recover/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args },
      ],
    }),
    softDeleteAppointment: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/appointment/soft-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args },
      ],
    }),
    getAvaibleTurnsByPractitioner: builder.query<
      ScheduleDays,
      { id: string; startDate: string; endDate: string; token: string }
    >({
      query: ({ id, startDate, endDate, token }) => ({
        url: `/appointment/available/practitioner/${id}`,
        params: { startDate, endDate },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});
export const {
  useGetAllAppointmentsQuery,
  useGetAllAppointmentsWithFiltersQuery,
  useLazyGetAllAppointmentsWithFiltersQuery,
  useGetOneAppointmentQuery,
  useGetAppointmentsBySpecialistQuery,
  useGetAllAppointmentsByPatientQuery,
  useLazyGetAllAppointmentsBySpecificDayQuery,
  useLazyGetAllAppointmentsByPatientQuery,
  useGetAllAppointmentsByPractitionerQuery,
  useLazyGetAllAppointmentsByPractitionerQuery,
  useGetAppointmentsByPatientQuery,
  useLazyGetAppointmentsByPatientQuery,
  useLazyGetAppointmentsByPatientAndPractitionerQuery,
  useGetAllAppointmentsBySpecialistQuery,
  useGetTypeAppointentStatsByPractitionerQuery,
  useGetAllSocialWorkStatsQuery,
  useLazyGetAllSocialWorkStatsQuery,
  useGetSocialWorkStatsByPractitionerIdQuery,
  useLazyGetSocialWorkStatsByPractitionerIdQuery,
  useGetTopPatientStatsQuery,
  useLazyGetTopPatientStatsQuery,
  useGetTopPatientStatsByPractitionerQuery,
  useLazyGetTopPatientStatsByPractitionerQuery,
  useGetAppointmentStatsAllPractitionerQuery,
  useLazyGetAppointmentStatsAllPractitionerQuery,
  useGetAppointmentStatsByPractitionerQuery,
  useLazyGetAppointmentStatsByPractitionerQuery,
  useLazyGetTypeAppointentStatsByPractitionerQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useSoftDeleteAppointmentMutation,
  useCancelAppointmentMutation,
  useReprogramAppointmentMutation,
  useCheckOverlapMutation,
  useRecoverAppointmentMutation,
  useGetAllAppointmentsIncludedDeletedQuery,
  useLazyGetAppointmentsBySpecialistQuery,
  useGetAppointmentCompletedByPractitionerQuery,
  useLazyGetAppointmentCompletedByPractitionerQuery,
  useLazyGetAppointmentCompletedAllPractitionerQuery,
  useLazyGetAvaibleTurnsByPractitionerQuery,
  useLazyGetScheduleIdQuery,
} = appointmentAPI;
