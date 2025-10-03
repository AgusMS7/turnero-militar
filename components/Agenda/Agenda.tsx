"use client";

import React, { useEffect, useState } from "react";
import CalendarioModal from "./CalendarioModal/CalendarioModal";
import Image from "next/image";
import CalendarioHorizontal from "./CalendarioHorizontal/CalendarioHorizontal";
import TurnoCard from "./TurnoCard/TurnoCard";
import TurnoRender from "./TurnoRender/TurnoRender";
import {
  Appointment,
  AppointmentSlotFiltered,
  PractitionerAppointment,
} from "@/app/definitions/definitions";
import AgendaSkeleton from "./AgendaSkeleton";
import VistaErrorGenerico from "../ErrorComponents/VistaErrorGenerico";
import { useSession } from "next-auth/react";
import {
  calcularIntervalos,
  calcularIntervalosConHorario,
  filtrarTurnos,
  monthNames,
} from "@/app/utils/helperFunctions";
import { useLazyGetAppointmenSlotsFilteredQuery } from "@/app/redux/api/appointmentSlot.api";

interface Props {
  turnos: Appointment[];
}

function mapDisponibilidad(nuevaRespuesta: AppointmentSlotFiltered) {
  const disponibilidad = nuevaRespuesta.data.flatMap((item: any) =>
    item.schedules.map((schedule: any) => ({
      openingHour: schedule.openingHour,
      closeHour: schedule.closeHour,
      durationAppointment: item.practitioner.durationAppointment || 30,
      day: item.day,
      unavailable: item.unavailable,
    }))
  );

  return disponibilidad;
}

export default function AgendaPaciente({ turnos }: Props) {
  const { data: session } = useSession();
  const token = session?.user.accessToken;
  const [trigger, { data: respuesta, isLoading, isError, isSuccess }] =
    useLazyGetAppointmenSlotsFilteredQuery();

  useEffect(() => {
    const id = localStorage.getItem("MID") || session?.user?.id || "";
    trigger({
      practitionerId: id,
      allDays: true,
      page: 1,
      limit: 10,
      token: token,
    });
    if (localStorage.getItem("MID") == undefined && id !== "") {
      localStorage.setItem("MID", id); //Por si acaso guardamos el id en localStorage
    }
  }, [session]);

  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | Date>(new Date());

  const handleDateClick = () => {
    setShowCalendar(true);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };
  const turnoFiltro = filtrarTurnos(turnos, selectedDate);

  if (isLoading) return <AgendaSkeleton />;
  if (isError)
    return (
      <VistaErrorGenerico
        titulo={"Error de agenda"}
        cuerpo={"Ocurrio un error al cargar la agenda, intentelo mas tarde"}
        tituloHeader={"Agenda Medico"}
      />
    );
  if (isSuccess) {
    const disponibilidad = mapDisponibilidad(respuesta);
    console.log("disponibilidad", disponibilidad);

    const dayOfWeek =
      selectedDate?.toLocaleString("es-ES", { weekday: "long" }) || "lunes";

    // Calcular intervalos de tiempo basados en el horario del practicante
    const intervalos: string[] = calcularIntervalosConHorario(
      disponibilidad,
      dayOfWeek,
      disponibilidad[0]?.durationAppointment
    );
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#E4ECEC] text-black">
        <div className="flex items-center justify-between font-bold p-4">
          <div className="flex items-center justify-center flex-grow">
            <div>
              <Image src="/logo.png" alt="Logo" width={75} height={75} />
            </div>

            <div
              className="flex cursor-pointer text-xl gap-2"
              onClick={handleDateClick}
            >
              {monthNames[selectedDate?.getMonth() || 0]},{" "}
              {selectedDate?.getDate()}
              <Image src="/arrow-down2.svg" alt="Logo" width={15} height={15} />
            </div>
          </div>
        </div>

        <div>
          {/*Parte superior*/}
          <CalendarioHorizontal
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            disponibilidad={disponibilidad}
            practitionerId={localStorage.getItem("MID") || ""}
          />
        </div>

        <div className="flex-grow overflow-y-auto p-4 relative">
          {" "}
          {/*Parte lateral*/}
          {intervalos.map((interval, index) => (
            <div
              key={index}
              className="h-12 border-b border-gray-400 flex items-center px-2"
            >
              {interval}
            </div>
          ))}
          {intervalos.map(
            (
              interval,
              index // Tarjeta de turno vacia
            ) => (
              <TurnoCard
                key={index}
                index={index}
                fechaTurno={selectedDate}
                horaTurno={interval}
                disponibilidad={disponibilidad}
                dayOfWeek={dayOfWeek}
              />
            )
          )}
          {turnoFiltro.map(
            (
              turno,
              index // Tarjeta de turno con turno activo
            ) => (
              <TurnoRender
                key={turno.id || index}
                turno={turno}
                disponibilidad={disponibilidad}
              />
            )
          )}
        </div>

        {showCalendar && (
          <CalendarioModal
            onSelectDate={handleDateSelect}
            initialDate={selectedDate || new Date()}
            onClose={handleCloseCalendar}
            disponibilidad={disponibilidad}
          />
        )}
      </div>
    );
  }
}
