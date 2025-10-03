"use client";
import { Appointment } from "@/app/definitions/definitions";
import { Session } from "next-auth";
import { Lexend, Lato } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BotonesDetalleTurno from "./BotonesDetalleTurno";
import ModalConfirmacionTurno from "../ModalConfirmacionTurno/ModalConfirmacionTurno";

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

interface CampoProps {
  width: string;
  label: string;
  value: string;
  latoClass?: string;
}

function Campo({ width, label, value, latoClass = "" }: CampoProps) {
  return (
    <div className={`${width}`}>
      <label
        className={`block text-sm font-medium text-gray-700 mb-2 ${latoClass}`}
      >
        {label}
      </label>
      <div
        className={`p-3 border border-gray-300 rounded-lg text-base bg-gray-50 text-gray-800 ${latoClass}`}
      >
        {value}
      </div>
    </div>
  );
}

interface Props {
  appointment: Appointment;
  session: Session | null;
  backUrl?: string;
}

export default function DetalleTurnoContainer({
  appointment,
  session,
  backUrl,
}: Props) {
  const router = useRouter();

  const getBackUrl = () => {
    if (backUrl) return backUrl;
    if (session?.user?.role === "secretary") return "/secretaria";
    if (session?.user?.role === "medico") return "/medico";
    return "/turnero/agenda";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha no disponible";

    const [year, month, day] = dateString.split("-").map(Number);

    if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
      return "Formato de fecha inválido";
    }

    const fecha = new Date(year, month - 1, day);

    if (isNaN(fecha.getTime())) {
      return "Fecha inválida";
    }

    const formato = Intl.DateTimeFormat("es-ES", {
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

  const formatTime = (timeString: string) => {
    if (!timeString) return "Hora no disponible";

    const [hours, minutes] = timeString.split(":");

    if (!hours || !minutes || isNaN(Number(hours)) || isNaN(Number(minutes))) {
      return "Hora inválida";
    }

    return `${hours}:${minutes}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Confirmado";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelado";
      case "completed":
        return "Completado";
      default:
        return status;
    }
  };

  return (
    <div className="flex justify-center items-center p-10">
      <div className="flex flex-col gap-6 p-6 border border-gray-600 rounded-xl w-full max-w-4xl">
        <div className="space-y-6">
          {/* Header con botón de volver */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(getBackUrl())}
              className="flex items-center justify-center size-10 hover:bg-teal-600/20 rounded-full transition-colors"
              title="Volver"
            >
              <Image
                src="/arrow-left.svg"
                alt="Volver"
                width={20}
                height={20}
              />
            </button>
            <h1
              className={`text-3xl font-bold text-gray-800 ${lexend.className}`}
            >
              Detalle del Turno
            </h1>
          </div>

          {/* Sección de información del paciente */}
          <div className="space-y-4">
            <h2
              className={`text-xl font-semibold text-gray-800 ${lexend.className}`}
            >
              Información del Paciente
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Campo
                width="w-full"
                label="Nombre"
                value={appointment.patient.name || ""}
                latoClass={lato.className}
              />
              <Campo
                width="w-full"
                label="Apellido"
                value={appointment.patient.lastName || ""}
                latoClass={lato.className}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Campo
                width="w-full"
                label="DNI"
                value={appointment.patient.dni || ""}
                latoClass={lato.className}
              />
              <Campo
                width="w-full"
                label="Teléfono"
                value={appointment.patient.phone || ""}
                latoClass={lato.className}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Campo
                width="w-full"
                label="Email"
                value={appointment.patient.email || ""}
                latoClass={lato.className}
              />
              <Campo
                width="w-full"
                label="Cobertura Médica"
                value={
                  appointment.patient.socialWorkEnrollment?.socialWork?.name ||
                  "Sin cobertura médica"
                }
                latoClass={lato.className}
              />
            </div>
          </div>

          {/* Sección de información del profesional */}
          <div className="space-y-4">
            <h2
              className={`text-xl font-semibold text-gray-800 ${lexend.className}`}
            >
              Información del Profesional
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Campo
                width="w-full"
                label="Nombre"
                value={`${appointment.practitioner.name} ${appointment.practitioner.lastName}`}
                latoClass={lato.className}
              />
              <Campo
                width="w-full"
                label="Especialidad"
                value={
                  appointment.practitioner.professionalDegree?.profession
                    ?.name || ""
                }
                latoClass={lato.className}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Campo
                width="w-full"
                label="Matrícula"
                value={appointment.practitioner.license || ""}
                latoClass={lato.className}
              />
              <Campo
                width="w-full"
                label="Email"
                value={appointment.practitioner.email || ""}
                latoClass={lato.className}
              />
            </div>
          </div>

          {/* Sección de detalles del turno */}
          <div className="space-y-4">
            <h2
              className={`text-xl font-semibold text-gray-800 ${lexend.className}`}
            >
              Detalles del Turno
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Campo
                width="w-full"
                label="Fecha"
                value={formatDate(appointment.date)}
                latoClass={lato.className}
              />
              <Campo
                width="w-full"
                label="Hora"
                value={formatTime(appointment.hour)}
                latoClass={lato.className}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Campo
                width="w-full"
                label="Dirección"
                value="Avenida San Martin 1243"
                latoClass={lato.className}
              />
              <div className="w-full">
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${lato.className}`}
                >
                  Estado
                </label>
                <div
                  className={`p-3 border rounded-lg text-base font-medium text-center ${getStatusColor(
                    appointment.status
                  )} ${lato.className}`}
                >
                  {getStatusText(appointment.status)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <BotonesDetalleTurno appointment={appointment} session={session} />
        </div>
      </div>

      <ModalConfirmacionTurno
        nombre={`${appointment.practitioner.name} ${appointment.practitioner.lastName}`}
        fecha={appointment.date}
        hora={appointment.hour}
      />
    </div>
  );
}
