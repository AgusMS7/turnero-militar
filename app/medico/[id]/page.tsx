"use client";
import { useGetOneAppointmentQuery } from "@/app/redux/api/appointment.api";
import VistaErrorGenerico from "@/components/ErrorComponents/VistaErrorGenerico";
import { use } from "react";
import { useSession } from "next-auth/react";
import DetalleTurnoContainer from "@/components/DetalleTurno/DetalleTurnoContainer";
import DetalleTurnoSkeleton from "@/components/Skeletons/DetalleTurnoSkeleton";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const { id } = use(params);
  const {
    data: appointment,
    isLoading,
    isError,
    isSuccess,
  } = useGetOneAppointmentQuery(id);

  if (isLoading) {
    return <DetalleTurnoSkeleton />;
  }
  if (isError)
    return (
      <VistaErrorGenerico
        titulo={"Error al cargar el turno"}
        cuerpo={
          "Ocurrio un error al cargar el detalle turno, intentelo mas tarde"
        }
        tituloHeader={"Detalle Turno"}
      />
    );
  if (isSuccess) {
    return (
      <DetalleTurnoContainer
        appointment={appointment}
        session={session}
        backUrl={session ? "/medico" : "/turnero/agenda"}
      />
    );
  }
}
