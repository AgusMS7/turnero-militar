import { Appointment, TurnStatus } from "@/app/definitions/definitions";
import { createSlice } from "@reduxjs/toolkit";

const initialState: Partial<Appointment> = {
  date: "",
  hour: "",
  status: TurnStatus.pending,
  practitioner: undefined,
  patient: {},
  id: "",
};

export const turnoSlice = createSlice({
  name: "turno",
  initialState,
  reducers: {
    setTurno: (state, action) => {
      state.date = action.payload.date;
      state.hour = action.payload.hour;
      state.status = action.payload.status;
      state.id = action.payload.id;
      state.practitioner = action.payload.practitioner; 
      state.patient = action.payload.patient;
    },
    clearTurno: (state) => {
      state.date = initialState.date;
      state.hour = initialState.hour;
      state.status = initialState.status;
      state.id = initialState.id;
      state.practitioner = initialState.practitioner;
      state.patient = initialState.patient;
    },
  },
});
export const { setTurno, clearTurno } = turnoSlice.actions;
