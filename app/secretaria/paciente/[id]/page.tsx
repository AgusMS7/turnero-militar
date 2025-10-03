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
import { useGetPatientByIdQuery } from "@/app/redux/api/patient.api";

export default function PatientOptions() {
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

  const { data: patient } = useGetPatientByIdQuery({ id, token });

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <MedicoHeader
          name={`${patient?.name ?? ""} ${patient?.lastName ?? ""}`}
          specialty={"Paciente"}
          genre={patient?.gender || ""}
          schedule={""}
          email={patient?.email || ""}
          phone={patient?.phone || ""}
          imageSrc={patient?.urlImg as string}
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
        </div>
      </div>
    </div>
  );
}
