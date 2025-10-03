"use client";
import { practitionerAPI } from "@/app/redux/api/practitioner.api";
import VistaErrorGenerico from "@/components/ErrorComponents/VistaErrorGenerico";
import DetalleMedicoSkeleton from "@/components/Skeletons/DetalleMedicoSkeleton";
import HeaderPage from "@/components/Turnero/HeaderPage";
import TurnoForm from "@/components/Turnero/TurnoForm";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Page() {
  const { data: session } = useSession();

  const [trigger, { data: practitioner, isLoading, isError, isSuccess }] =
    practitionerAPI.endpoints.getOnePractitioner.useLazyQuery();

  useEffect(() => {
    const id = localStorage.getItem("MID") || session?.user.id || "";
    trigger(id);
  }, []);

  if (isLoading) {
    return <DetalleMedicoSkeleton />;
  }
  if (isError) {
    return (
      <VistaErrorGenerico
        titulo={"Error al cargar el formulario"}
        cuerpo={"Ocurrio un error al cargar el formulario, intentelo mas tarde"}
        tituloHeader={"Solicitar Turno"}
        urlRetorno={session ? "/medico" : "/turnero/agenda"}
      />
    );
  }
  if (isSuccess) {
    return (
      <>
        <HeaderPage
          titulo={"Crear Turno"}
          urlRetorno={session ? "/medico" : "/turnero/agenda"}
        />
        <div className="p-3">
          <TurnoForm practitioner={practitioner} />
        </div>
      </>
    );
  }
}
