import {
  Patient,
  PatientGet,
  TokenWithEntity,
  TokenWithId,
  DocumentTypes,
  PatientRegistrationStatus,
  PatientCredentialsUpdate,
} from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const patientApi = createApi({
  reducerPath: "patient",
  tagTypes: ["patient"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    getAllPatients: builder.query<PatientGet, 
    {
      token:string,
      patientId?:string,
      patientName?:string,
      patientDni?:string,
      patientEmail?:string,
      limit?:string,
      page?:string,
    }
    >({
      query: ({ token, patientId, patientName, patientDni, patientEmail, limit, page}) => ({
        url: `patient`,
        params:{
          patientId,
          patientName,
          patientDni,
          patientEmail,
          withAppointments:false,
          limit,
          page,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result) =>
        result
          ? result.patients.map(({ id }) => ({ type: "patient", id }))
          : [],
    }),
    getPatientById: builder.query<Patient, TokenWithId>({
      query: ({ token, id }) => ({
        url: `patient/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "patient", id: id }],
    }),
    getPatientWithFamilyGroup: builder.query<Patient, TokenWithId>({
      query: ({ id, token }) => ({
        url: `patient/${id}`,
        params: {
          withFamilyMembers: true,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "patient", id: id }],
    }),
    getPatientsAdvanced: builder.query<PatientGet, TokenWithEntity>({
      query: ({ token, entity }) => ({
        url: `patient?limit=${entity.limit}&page=${entity.page}&patientId=${entity.patientId}&status=${entity.status}&withAppointments=${entity.withAppointments}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["patient"],
    }),
    createFamilyMemberPatient: builder.mutation<void, TokenWithEntity>({
      query: ({ token, entity }) => {
        return {
          url: "/patient",
          method: "POST",
          body: entity,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: (result, error, { entity }) => [
        { type: "patient", id: entity.headPatientId },
      ],
    }),
    createPatient: builder.mutation<void, TokenWithEntity>({
      query: ({ token, entity }) => {
        return {
          url: "/patient",
          method: "POST",
          body: entity,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: (result, error, { entity }) => [
        { type: "patient", id: entity.id },
      ],
    }),
    updatePatientById: builder.mutation<PatientGet, TokenWithEntity>({
      query: ({ token, entity }) => {
        const { id, ...patientData } = entity;

        return {
          url: `patient/${id}`,
          method: "PATCH",
          body: patientData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: (result, error, args) => [
        { type: "patient", id: args.entity.id },
      ],
    }),
    getPatientByDocument: builder.query<Patient, {
      token: string;
      type: DocumentTypes;
      number: string;
      withAppointments?: boolean;
      withFamilyMembers?: boolean;
    }>({
      query: ({ token, type, number, withAppointments, withFamilyMembers }) => {
        const params = new URLSearchParams();
        if (withAppointments !== undefined) {
          params.append('withAppointments', withAppointments.toString());
        }
        if (withFamilyMembers !== undefined) {
          params.append('withFamilyMembers', withFamilyMembers.toString());
        }
        
        return {
          url: `patient/document/${type.toLowerCase()}/${number}?${params.toString()}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: (result, error, { type, number }) => [
        { type: "patient", id: `${type}-${number}` },
      ],
    }),
    getPatientRegistrationStatus: builder.query<PatientRegistrationStatus, {
      type: DocumentTypes;
      number: string;
    }>({
      query: ({ type, number }) => ({
        url: `patient/document/${type.toLowerCase()}/${number}/registration-status`,
      }),
      providesTags: (result, error, { type, number }) => [
        { type: "patient", id: `status-${type}-${number}` },
      ],
    }),
    updatePatientCredentials: builder.mutation<Patient, {
      id: string;
      credentials: PatientCredentialsUpdate;
    }>({
      query: ({ id, credentials }) => ({
        url: `patient/${id}/credentials`,
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "patient", id: id },
      ],
    }),
  }),
});

export const {
  useGetAllPatientsQuery,
  useLazyGetAllPatientsQuery,
  useGetPatientByIdQuery,
  useLazyGetPatientByIdQuery,
  useGetPatientWithFamilyGroupQuery,
  useGetPatientsAdvancedQuery,
  useCreatePatientMutation,
  useCreateFamilyMemberPatientMutation,
  useUpdatePatientByIdMutation,
  useLazyGetPatientByDocumentQuery,
  useLazyGetPatientRegistrationStatusQuery,
  useUpdatePatientCredentialsMutation,
} = patientApi;
