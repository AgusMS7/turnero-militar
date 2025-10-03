"use client";
import { useGetOneAppointmentQuery } from "@/app/redux/api/appointment.api";
import ModalConfirmacionTurno from "@/components/ModalConfirmacionTurno/ModalConfirmacionTurno";
import DatosProfesional from "@/components/Turno/DatosProfesional";
import DatosTurno from "@/components/Turno/DatosTurno";
import Image from "next/image";
import VistaErrorGenerico from "@/components/ErrorComponents/VistaErrorGenerico";
import HeaderPage from "@/components/Turnero/HeaderPage";
import DetalleMedicoSkeleton from "@/components/Skeletons/DetalleMedicoSkeleton";
import { use } from "react";
import { useSession } from "next-auth/react";
import BotonesDetalleTurno from "@/components/DetalleTurno/BotonesDetalleTurno";

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
    return (
      <div className="text-black">
        <HeaderPage titulo="Detalle Turno" />
        <div className="px-3">
          <div>
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto"
            />
          </div>
          <DetalleMedicoSkeleton />
        </div>
      </div>
    );
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
      <div className="w-full h-screen bg-[#E4ECEC] text-black p-5 flex flex-col justify-between overflow-auto">
        <HeaderPage
          titulo={"Detalle Turno"}
          urlRetorno={session ? "/medico" : "/turnero/agenda"}
        />
        <div>
          <h1 className="font-bold text-2xl my-4 text-black">
            Detalle del Turno
          </h1>
          <DatosProfesional practitioner={appointment.practitioner} />
          <DatosTurno
            fechaTurno={appointment.date}
            horaTurno={appointment.hour}
            direccion={"Avenida San Martin 1243"}
            estado={appointment.status}
          />
        </div>
        <BotonesDetalleTurno appointment={appointment} session={session} />
        <ModalConfirmacionTurno
          nombre={`${appointment.practitioner.name} ${appointment.practitioner.lastName}`}
          fecha={appointment.date}
          hora={appointment.hour}
        />
      </div>
    );
  }
}
