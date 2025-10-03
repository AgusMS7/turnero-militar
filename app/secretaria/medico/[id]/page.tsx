// pages/secretaria/medico/options/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { MedicoHeader } from "@/components/Secretaria/InfoMedico/MedicoHeader";
import { InfoCard } from "@/components/Secretaria/InfoMedico/InfoCard";
import { useLazyGetAppointmentsBySpecialistQuery } from "@/app/redux/api/appointment.api";
import { useSession } from "next-auth/react";
import { useGetOnePractitionerQuery } from "@/app/redux/api/practitioner.api";
import { TrendingUp, User, History, Calendar } from "lucide-react";

export default function MedicoOptions() {
  const router = useRouter();

  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const { data: medico } = useGetOnePractitionerQuery({ id, token });

  const [getAppointments, { data: turnos }] =
    useLazyGetAppointmentsBySpecialistQuery();

  useEffect(() => {
    if (id && token) {
      getAppointments({ id, token });
    }
  }, [id, token, getAppointments]);
  console.log("turnos", turnos);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <MedicoHeader
          name={`${medico?.name ?? ""} ${medico?.lastName ?? ""}`}
          specialty={
            medico?.professionalDegree?.profession.name ??
            "Especialidad no disponible"
          }
          genre={medico?.gender || ""}
          schedule={""}
          email={medico?.email || ""}
          phone={medico?.phone || ""}
          imageSrc={medico?.urlImg as string}
        />

        <div className="grid grid-cols-2 gap-6">
          <InfoCard
            icon={<User className="w-8 h-8 text-teal-500" />}
            iconBgColor="bg-teal-100"
            title="Información general"
            description="Consulta los datos esenciales del médico, incluyendo su matrícula, contacto y disponibilidad."
            linkText="Ver información"
            href={`/secretaria/medico/info/${id}`}
          />
          <InfoCard
            icon={<Calendar className="w-8 h-8 text-blue-500" />}
            iconBgColor="bg-blue-100"
            title="Agenda del Médico"
            description="Visualiza y gestiona la agenda del médico, incluyendo turnos disponibles y ocupados."
            linkText="Ver agenda"
            href={`/secretaria/medico/agenda/${id}`}
          />
          <InfoCard
            icon={<TrendingUp className="w-8 h-8 text-green-500" />}
            iconBgColor="bg-green-100"
            title="Estadísticas de Turnos"
            description="Revisa los turnos atendidos y su clasificación por tipo."
            linkText="Ver estadísticas"
            href={`/secretaria/estadisticas/${id}`}
          />
          <InfoCard
            icon={<History className="w-8 h-8 text-purple-500" />}
            iconBgColor="bg-purple-100"
            title="Historial de pacientes"
            description="Accede al registro de pacientes atendidos y detalles de las consultas realizadas."
            linkText="Ver historial"
            href={`/secretaria/historial/${id}`}
          />
        </div>
      </div>
    </div>
  );
}
