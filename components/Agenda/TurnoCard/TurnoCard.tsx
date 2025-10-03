"use client";
import { PractitionerAppointment } from "@/app/definitions/definitions";
import { useLazyGetScheduleIdQuery } from "@/app/redux/api/appointment.api";
import {
  isHorarioAtencionActivo,
  isTimeSlotAvailable,
} from "@/app/utils/helperFunctions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";

interface TurnoCardProps {
  index: number;
  fechaTurno: Date;
  horaTurno: string;
  disponibilidad: PractitionerAppointment[];
  dayOfWeek?: string;
}

const TurnoCard: React.FC<TurnoCardProps> = ({
  index,
  fechaTurno,
  horaTurno,
  disponibilidad,
  dayOfWeek,
}) => {
  const { data: session } = useSession();

  const [trigger, { data: respuesta }] = useLazyGetScheduleIdQuery();

  const blockHeight = 48;
  const top = index * blockHeight;
  const router = useRouter();

  const handleClick = async () => {
    const isAvailableByTime = isHorarioAtencionActivo(
      horaTurno,
      disponibilidad,
      fechaTurno
    );
    const isAvailableByWorkingHours = dayOfWeek
      ? isTimeSlotAvailable(
          horaTurno,
          disponibilidad,
          dayOfWeek,
          disponibilidad[0]?.durationAppointment
        )
      : true;

    if (!isAvailableByTime || !isAvailableByWorkingHours) {
      return;
    }
    localStorage.setItem("fechaTurno", fechaTurno.toISOString().split("T")[0]);
    localStorage.setItem("horaTurno", horaTurno);

    // Llamar a la API para obtener scheduleId y slotId
    try {
      const res = await trigger({
        practitionerId: localStorage.getItem("MID") || "",
        date: fechaTurno.toISOString().split("T")[0],
        hour: horaTurno,
        token: session?.user.accessToken || "",
      }).unwrap();
      localStorage.setItem("scheduleId", res.scheduleId);
      localStorage.setItem("slotId", res.slotId);
    } catch (error) {
      console.error("Error al obtener scheduleId y slotId:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo obtener la información del turno. Por favor, inténtelo de nuevo.",
      });
      return;
    }
    if (session) {
      if (session.user.role === "secretary") {
        const practitionerId = localStorage.getItem("MID");
        router.push(`/secretaria/medico/crearTurno/${practitionerId}`);
      } else {
        router.push(`/medico/crearTurno`);
      }
    } else {
      router.push(`/turnero/nuevoTurno`);
    }
  };

  const isAvailableByTime = isHorarioAtencionActivo(
    horaTurno,
    disponibilidad,
    fechaTurno
  );
  const isAvailableByWorkingHours = dayOfWeek
    ? isTimeSlotAvailable(
        horaTurno,
        disponibilidad,
        dayOfWeek,
        disponibilidad[0]?.durationAppointment
      )
    : true;
  const isAvailable = isAvailableByTime && isAvailableByWorkingHours;

  return (
    <div
      onClick={handleClick}
      className={`absolute left-0 w-full border-b border-black cursor-pointer ${
        isAvailable
          ? "bg-blue-400 hover:bg-blue-600"
          : "bg-gray-400 opacity-50 cursor-not-allowed"
      }`}
      style={{
        top: `${top + 16}px`,
        height: `${blockHeight}px`,
        transform: "translateX(70px)",
      }}
    >
      <p className="font-bold text-black mt-1 ml-20 p-2 absolute inline-block">
        {isAvailable ? "Disponible" : "No Disponible"}
      </p>
    </div>
  );
};

export default TurnoCard;
