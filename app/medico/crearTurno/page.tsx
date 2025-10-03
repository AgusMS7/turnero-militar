"use client";
import { useLazyGetOnePractitionerQuery } from "@/app/redux/api/practitioner.api";
import { useGetAllSocialWorksQuery } from "@/app/redux/api/socialWork.api";
import VistaErrorGenerico from "@/components/ErrorComponents/VistaErrorGenerico";
import FormTurnoSkeleton from "@/components/Skeletons/FormTurnoSkeleton";
import HeaderPage from "@/components/Turnero/HeaderPage";
import TurnoForm from "@/components/Turnero/TurnoForm";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Page() {
  const { data: session } = useSession();

  const [trigger, { data: practitioner, isLoading, isError, isSuccess }] =
    useLazyGetOnePractitionerQuery();

  useEffect(() => {
    const token = session?.user?.accessToken;
    const id = localStorage.getItem("MID") || "";
    trigger({
      token: token,
      id: id,
    });
  }, []);

  if (isLoading) {
    return (
      <>
        <HeaderPage
          titulo={"Crear Turno"}
          urlRetorno={session ? "/medico" : "/turnero/agenda"}
        />
        <div className="p-3">
          <FormTurnoSkeleton />
        </div>
      </>
    );
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
