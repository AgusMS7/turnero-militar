"use client";
import {
  Appointment,
  Turno,
  AvailableItem,
} from "@/app/definitions/definitions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Lexend, Inter } from "next/font/google";
import Medico from "../PedirTurno/Medico";
import Turnos from "../PedirTurno/Turnos";
import {
  useLazyGetAvaibleTurnsByPractitionerQuery,
  useReprogramAppointmentMutation,
} from "@/app/redux/api/appointment.api";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

interface Props {
  turno: Appointment;
}

export default function ReprogramarTurno({ turno }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno | null>(
    null
  );
  const [triggerTurn, { data: turnos }] =
    useLazyGetAvaibleTurnsByPractitionerQuery();
  const [reprogramAppointment] = useReprogramAppointmentMutation();

  const token = session?.user.accessToken;

  const practitionerId = turno.practitioner?.id;

  useEffect(() => {
    if (!selectedDate && practitionerId && token) {
      setSelectedDate("");
    }
  }, [selectedDate, practitionerId, token]);

  // Si se selecciona una fecha, se llama a la API para obtener los turnos disponibles
  useEffect(() => {
    if (practitionerId && token && selectedDate && selectedDate !== "") {
      triggerTurn({
        id: practitionerId,
        startDate: selectedDate,
        endDate: selectedDate,
        token: token,
      });
    }
  }, [practitionerId, token, triggerTurn, selectedDate]);

  const formatearFecha = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);
    const fecha = new Date(year, month - 1, day);

    const formato = Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const fechaFormateada = formato.format(fecha);
    const fechaFinal =
      fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    return fechaFinal;
  };

  const handleConfirmarReprogramacion = async () => {
    if (!turnoSeleccionado) return;

    try {
      const reprogramData = {
        id: turno.id,
        date: selectedDate,
        hour: turnoSeleccionado.horario,
        scheduleId: turnoSeleccionado.scheduleId,
        slotId: turnoSeleccionado.slotId,

        observation: "Reprogramado por el paciente",
      };

      await reprogramAppointment(reprogramData).unwrap();

      Swal.fire({
        icon: "success",
        title: "¡Reprogramación exitosa!",
        text: "El turno ha sido reprogramado correctamente",
        confirmButtonText: "Continuar",
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
      .then(() => {
       router.push("/paciente");
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al reprogramar turno",
        text: error?.data?.message || "No se pudo reprogramar el turno.",
        timer: 4000,
        timerProgressBar: true,
      });
    }
  };

  const handleCancelarReprogramacion = () => {
    Swal.fire({
      title: "¿Cancelar reprogramación?",
      text: "Volverás al historial sin hacer cambios",
      icon: "warning",
      confirmButtonText: "Sí, cancelar",
      showCancelButton: true,
      cancelButtonText: "Continuar reprogramando",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/paciente/historial");
      }
    });
  };

  const turnosDisponibles: Turno[] = turnos
    ? (turnos?.days?.[0]?.available as AvailableItem[] | undefined)?.map(
        (item) => ({
          horario: item.time,
          scheduleId: item.scheduleId,
          slotId: item.slotId,
        })
      ) ?? []
    : [];

  return (
    <div className="flex justify-center items-center p-6">
      <div className="rounded-2xl shadow-xl max-w-6xl w-full min-h-[600px] min-w-[70vw] overflow-y-auto relative flex flex-col">
        {/* Información del turno actual */}
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
          <h2
            className={`text-center text-gray-900 mb-6 font-semibold text-3xl ${lexend.className}`}
          >
            Turno Actual
          </h2>
          <div className="flex justify-center items-center gap-6">
            <div className="text-center">
              <p
                className={`text-gray-600 font-normal text-xl ${inter.className}`}
              >
                Fecha actual
              </p>
              <p
                className={`text-gray-900 font-semibold text-2xl ${lexend.className}`}
              >
                {formatearFecha(turno.date)}
              </p>
            </div>
            <div className="text-center">
              <p
                className={`text-gray-600 font-normal text-xl ${inter.className}`}
              >
                Hora actual
              </p>
              <p
                className={`text-gray-900 font-semibold text-2xl ${lexend.className}`}
              >
                {turno.hour}
              </p>
            </div>
          </div>
        </div>

        {/* Información del médico */}
        <Medico
          nombre={`${turno.practitioner.name} ${turno.practitioner.lastName}`}
          especialidad={
            turno.practitioner.professionalDegree?.profession?.name ||
            "Especialidad"
          }
          url={turno.practitioner.urlImg}
          appointmentSlots={turno.practitioner.appointmentSlots}
        />

        {/* Selección de nueva fecha y hora */}
        <div className="px-8 py-6 bg-white flex-1 flex flex-col">
          <h2
            className={`text-center text-gray-900 mb-8 font-semibold text-4xl ${lexend.className}`}
          >
            Seleccionar nueva fecha y hora
          </h2>

          <div className="flex-1 flex flex-col">
            <Turnos
              turnos={turnosDisponibles}
              onSelect={(t) => setTurnoSeleccionado(t)}
              selectedDate={selectedDate}
              onSelectDate={(d) => setSelectedDate(d)}
              lexendClass={lexend.className}
              interClass={inter.className}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="px-8 py-6 border-t border-gray-200 bg-white">
          <div className="flex justify-center gap-4">
            <button
              className={`px-8 py-3 rounded-xl font-normal text-2xl transition-all duration-200 shadow-md hover:shadow-lg ${inter.className} bg-gray-500 text-white hover:bg-gray-600`}
              onClick={handleCancelarReprogramacion}
            >
              Cancelar
            </button>
            <button
              className={`px-8 py-3 rounded-xl font-normal text-2xl transition-all duration-200 shadow-md hover:shadow-lg ${
                inter.className
              } ${
                turnoSeleccionado
                  ? "bg-teal-600 text-white hover:bg-teal-700 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!turnoSeleccionado}
              onClick={handleConfirmarReprogramacion}
            >
              Confirmar Reprogramación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
