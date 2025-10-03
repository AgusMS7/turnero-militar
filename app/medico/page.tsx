"use client";
import {
  useLazyGetAppointmentsBySpecialistQuery,
} from "@/app/redux/api/appointment.api";
import Agenda from "@/components/Agenda/Agenda";
import AgendaSkeleton from "@/components/Agenda/AgendaSkeleton";
import VistaErrorGenerico from "@/components/ErrorComponents/VistaErrorGenerico";
import { useSession } from "next-auth/react";
import { useEffect } from "react";



export default function Page() {
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const [trigger, { data: appointments, isLoading, isError, isSuccess }] =
    useLazyGetAppointmentsBySpecialistQuery();

  useEffect(() => {
    const id = localStorage.getItem("MID") || session?.user?.id || "";
    trigger({id, token});
    if (localStorage.getItem("MID") == undefined && id !== "") {
      localStorage.setItem("MID", id); //Por si acaso guardamos el id en localStorage
    }
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
