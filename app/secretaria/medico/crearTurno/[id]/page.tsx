"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLazyGetOnePractitionerQuery } from "@/app/redux/api/practitioner.api";
import VistaErrorGenerico from "@/components/ErrorComponents/VistaErrorGenerico";
import FormTurnoSkeleton from "@/components/Skeletons/FormTurnoSkeleton";
import HeaderPage from "@/components/Turnero/HeaderPage";
import TurnoForm from "@/components/Turnero/TurnoForm";

export default function CrearTurnoSecretaria() {
  const params = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const [trigger, { data: practitioner, isLoading, isError, isSuccess }] =
    useLazyGetOnePractitionerQuery();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "secretary") {
      router.push("/login");
      return;
    }

    if (!id) {
      router.push("/secretaria");
      return;
    }

    const token = session?.user?.accessToken;
    if (token && id) {
      trigger({
        token: token,
        id: id,
      });
    }
  }, [session, status, id, router, trigger]);

  if (status === "loading" || isLoading) {
    return (
      <>
        <HeaderPage
          titulo={"Crear Turno - Secretaria"}
          urlRetorno={`/secretaria/medico/agenda/${id}`}
        />
        <div className="p-3">
          <FormTurnoSkeleton />
        </div>
      </>
    );
  }

  if (!session || session.user.role !== "secretary") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">No autorizado</div>
      </div>
    );
  }

  if (isError) {
    return (
      <VistaErrorGenerico
        titulo={"Error al cargar el formulario"}
        cuerpo={"Ocurrio un error al cargar el formulario, intentelo mas tarde"}
        tituloHeader={"Crear Turno - Secretaria"}
        urlRetorno={`/secretaria/medico/agenda/${id}`}
      />
    );
  }

  if (isSuccess && practitioner) {
    return (
      <>
        <HeaderPage
          titulo={"Crear Turno - Secretaria"}
          urlRetorno={`/secretaria/medico/agenda/${id}`}
        />
        <div className="p-3">
          <TurnoForm practitioner={practitioner} />
        </div>
      </>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg">Cargando...</div>
    </div>
  );
}
