"use client";
import { Appointment, TurnStatus } from "@/app/definitions/definitions";
import {
  useUpdateAppointmentMutation,
} from "@/app/redux/api/appointment.api";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
interface Props {
  turno: Appointment;
}

const estadosTurno: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  completed: "Completado",
  cancelled: "Cancelado",
  absent: "Ausente",
};

export default function DetalleTurno({ turno }: Props) {
  const { data } = useSession();
  const [updateAppointent, { isSuccess: cancelado, error: errorCancelar }] =
    useUpdateAppointmentMutation();
  const router = useRouter();
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

  const handleReprogramarTurno = async () => {
    console.log("Reprogramar turno");
    Swal.fire({
      title: "¿Seguro que quiere reprogramar el turno?",
      text: "Podra seleccionar una nueva fecha y hora para el turno",
      icon: "question",
      confirmButtonText: "Si, estoy seguro",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        router.push(`/paciente/reprogramar-turno/${turno.id}`);
      }
    });
  };
  const handleCancelarTurno = async () => {
    Swal.fire({
      title: "¿Seguro que quiere cancelar el turno?",
      text: "Esta accion no se podra deshacer",
      icon: "warning",
      confirmButtonText: "Si, estoy seguro",
      showCancelButton: true,
      cancelButtonText: "No",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const turnoCancelado: Partial<Appointment> = {
          id: turno.id,
          status: TurnStatus.cancelled,
        };
        await updateAppointent(turnoCancelado)
          .unwrap()
          .then(() => {
            Swal.fire(
              "Operación exitosa!",
              "Turno cancelado correctamente",
              "success"
            );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire(
              "Error!",
              "Hubo un error al cancelar el turno, intente de nuevo más tarde",
              "error"
            );
          });
      }
    });
  };

  return (
    <div className="text-xl h-full flex flex-col">
      {/**Datos del turno */}
      <div
        className="bg-white w-3/5 max-lg:w-4/5 max-md:w-full max-md:p-0 m-auto p-5 rounded-2xl shadow-md flex flex-col gap-10 
        *:p-5 *:w-9/10 *:m-auto
        [&_h3]:opacity-60 [&_h3]:text-lg
        [&_span]:font-bold"
      >
        {/**Info medico */}
        <div className="flex gap-5 items-center border-b-3 border-b-gray-300">
          <img
            className="rounded-full object-cover h-15"
            src={
              turno.practitioner.urlImg
                ? turno.practitioner.urlImg
                : "/UserIconPlaceholder.jpg"
            }
            alt="Imagen medico"
          />
          <div>
            <h2>
              {turno.practitioner.name} {turno.practitioner.lastName}
            </h2>
            <h3>{turno.practitioner.professionalDegree.profession.name}</h3>
          </div>
        </div>
        {/**Turno y paciente */}
        <div className="flex flex-col gap-5">
          <h2>
            <span>Estado: </span>
            {estadosTurno[turno.status]}
          </h2>
          <h2>
            <span>Paciente: </span>
            {turno.patient.name} {turno.patient.lastName}
          </h2>
          <h2>
            <span>Fecha: </span>
            {formatearFecha(turno.date)}
          </h2>
          <h2>
            <span>Hora: </span>
            {turno.hour}
          </h2>
          <h2>
            <span>Direccion: </span>
            Av. Boulogne Sur Mer 1700
          </h2>
          <h2>
            <span>Obra social: </span>
            {turno?.socialWork?.name || "Particular"}
          </h2>
        </div>
      </div>
      {/**Botones */}
      {turno.status != "cancelled" && turno.status != "completed" && (
        <div
          className="m-auto w-2/5 max-md:w-full max-lg:w-4/5 p-10 flex justify-around gap-5
        *:border-2 *:border-[#087374] *:py-2 *:w-full *:shadow-md *:rounded-lg"
        >
          <button
            onClick={handleCancelarTurno}
            className="text-[#087374]
            cursor-pointer
            transition-transform hover:scale-105"
          >
            Cancelar turno
          </button>
          <button
            className="text-white bg-[#087374]
            cursor-pointer
            transition-transform hover:scale-105"
            onClick={handleReprogramarTurno}
          >
            Reprogramar turno
          </button>
        </div>
      )}
    </div>
  );
}
