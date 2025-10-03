"use client";
import {
  appointmentAPI,
} from "@/app/redux/api/appointment.api";
import Agenda from "@/components/Agenda/Agenda";
import AgendaSkeleton from "@/components/Agenda/AgendaSkeleton";
import VistaErrorGenerico from "@/components/ErrorComponents/VistaErrorGenerico";
import { useSession } from "next-auth/react";
import { useEffect} from "react";

export default function Page() {
  const { data: session } = useSession();

  const [trigger, { data: appointments, isLoading, isError, isSuccess }] =
  appointmentAPI.endpoints.getAppointmentsBySpecialist.useLazyQuery();

  useEffect(() => {
    const id = localStorage.getItem("MID") || session?.user?.id || "";
    trigger(id);
  }, [session]);
  
  if (isLoading) return <AgendaSkeleton />;
  if (isError)
    return (
      <VistaErrorGenerico
        titulo={"Error al cargar la agenda"}
        cuerpo={
          "Se ha producido un error al cargar esta agenda, intentelo mas tarde"
        }
        tituloHeader={"Agenda"}
        urlRetorno={session ? "/" : ""}
      />
    );
  if (isSuccess) {
    return <Agenda turnos={appointments} />;
  }
}
