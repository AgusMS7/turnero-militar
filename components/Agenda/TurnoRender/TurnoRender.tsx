"use client";
import {
  Appointment,
  PractitionerAppointment,
  TurnStatus,
} from "@/app/definitions/definitions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

interface TurnoProps {
  turno: Appointment;
  disponibilidad: PractitionerAppointment[];
}

const TurnoRender: React.FC<TurnoProps> = ({ turno, disponibilidad }) => {
  const { data: session } = useSession();
  const startHour = 7;
  const [hour, minute] = turno.hour.split(":").map(Number);
  const nombreCompleto = `${turno.patient.name} ${turno.patient.lastName}`;
  const obraSocial = `${turno.patient.socialWorkEnrollment?.socialWork?.name}`;
  const telefono = turno.patient.phone;

  const startTotalMinutes = (hour - startHour) * 60 + minute;

  const height = 48;
  const top = (startTotalMinutes / disponibilidad[0].durationAppointment) * 48;
  if (session) {
    const getDetailUrl = () => {
      if (session.user.role === "secretary") {
        return `/secretaria/medico/turno/${turno.id}`;
      } else {
        return `/medico/${turno.id}`;
      }
    };

    return (
      <Link href={getDetailUrl()}>
        <div
          className={`absolute flex w-full font-bold text-gray-800 text-center`}
          style={{
            backgroundColor:
              turno.status.valueOf() === TurnStatus.approved.valueOf()
                ? turno.typeAppointment.color
                : "#FDE047",
            top: `${top + 16}px`,
            height: `${height}px`,
            transform: "translateX(55px)",
          }}
        >
          <div className="flex flex-col ml-11 md:flex-row md:items-center md:gap-2">
            {/* Nombre Completo */}
            <p className="-mb-1 mt-0.5 md:mt-3 md:mr-0">{nombreCompleto}</p>

            {/* Obra Social y Teléfono */}
            <div className="flex gap-2 md:mt-4">
              {/* Obra Social */}
              <p>{obraSocial}</p>
              {/* Teléfono */}
              <p>{telefono}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  } else {
    return (
      <div
        className={`bg-gray-500 p-2 absolute inline-block w-full border-b border-black cursor-not-allowed`}
        style={{
          top: `${top + 16}px`,
          height: `${height}px`,
          transform: "translateX(55px)",
        }}
      >
        <p className="font-bold text-white ml-20 mt-1">Reservado</p>
      </div>
    );
  }
};

export default TurnoRender;
