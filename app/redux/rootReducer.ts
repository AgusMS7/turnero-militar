import { combineReducers } from "@reduxjs/toolkit";
import { appointmentAPI } from "./api/appointment.api";
import { practitionerAPI } from "./api/practitioner.api";
import { practitionerRoleAPI } from "./api/practitionerRole.api";
import { practitionerAppointmentAPI } from "./api/practitionerAppointment.api";
import { turnoSlice } from "./slices/turno.slice";
import { authenticationApi } from "./api/authentication.api";
import { socialWorkApi } from "./api/socialWork.api";
import { practitionerSocialWorkAPI } from "./api/practitionerSocialWork.api";
import { typeAppointmentApi } from "./api/typeAppointment.api";
import { professionalDegreeApi } from "./api/professionalDegree.api";
import { patientApi } from "./api/patient.api";
import { appointmentSlotApi } from "./api/appointmentSlot.api";
import { secretaryApi } from "./api/secretary.api";

export const reducers = combineReducers({
  [appointmentAPI.reducerPath]: appointmentAPI.reducer,
  [typeAppointmentApi.reducerPath]: typeAppointmentApi.reducer,
  [practitionerAPI.reducerPath]: practitionerAPI.reducer,
  [practitionerRoleAPI.reducerPath]: practitionerRoleAPI.reducer,
  [practitionerAppointmentAPI.reducerPath]: practitionerAppointmentAPI.reducer,
  [turnoSlice.name]: turnoSlice.reducer,
  [authenticationApi.reducerPath]: authenticationApi.reducer,
  [socialWorkApi.reducerPath]: socialWorkApi.reducer,
  [practitionerSocialWorkAPI.reducerPath]: practitionerSocialWorkAPI.reducer,
  [patientApi.reducerPath]: patientApi.reducer,
  [professionalDegreeApi.reducerPath]: professionalDegreeApi.reducer,
  [appointmentSlotApi.reducerPath]: appointmentSlotApi.reducer,
  [secretaryApi.reducerPath]:secretaryApi.reducer,
});

export const middleware = [
  appointmentAPI.middleware,
  typeAppointmentApi.middleware,
  practitionerAPI.middleware,
  practitionerRoleAPI.middleware,
  practitionerAppointmentAPI.middleware,
  authenticationApi.middleware,
  socialWorkApi.middleware,
  practitionerSocialWorkAPI.middleware,
  patientApi.middleware,
  professionalDegreeApi.middleware,
  appointmentSlotApi.middleware,
  secretaryApi.middleware,
];
