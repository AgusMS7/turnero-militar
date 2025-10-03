"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLazyGetAppointmentsBySpecialistQuery } from "@/app/redux/api/appointment.api";
import { useSession } from "next-auth/react";
import AgendaSecretaria from "@/components/Agenda/AgendaSecretaria";

export default function AgendaMedico() {
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const [getAppointments, { data: turnos }] =
    useLazyGetAppointmentsBySpecialistQuery();

  useEffect(() => {
    if (id && token) {
      getAppointments({ id, token });
    }
  }, [id, token, getAppointments]);

  if (!id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">ID de médico no válido</p>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <AgendaSecretaria turnos={turnos || []} practitionerId={id} />
    </div>
  );
}
