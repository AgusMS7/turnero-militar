"use client";

import { useGetOneAppointmentQuery } from "@/app/redux/api/appointment.api";
import Volver from "@/components/Paciente/Configuracion/Volver";

import { useParams } from "next/navigation";
import Image from "next/image";
import ReprogramarTurno from "@/components/Paciente/Turno/ReprogramarTurno";

export default function ReprogramarTurnoPage() {
  const params = useParams();
  const {
    data: turno,
    isLoading,
    isSuccess,
    error,
  } = useGetOneAppointmentQuery(params.id as string);

  return (
    <div className="w-full p-4 flex flex-col gap-10 bg-[#F3F8F8] min-h-screen">
      <Volver link="/paciente" />
      <div className="text-2xl flex flex-col gap-10">
        <h1 className="font-semibold text-3xl text-center">
          Reprogramar Turno
        </h1>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="flex flex-col justify-center gap-2 items-center bg-white shadow-md md:w-xl w-11/12 h-44 rounded-2xl">
              <Image
                className="w-10 h-10"
                src="/hourglass.svg"
                alt="Loading"
                width={40}
                height={40}
              />
              <p className="md:text-3xl text-xl">Cargando...</p>
            </div>
          </div>
        ) : isSuccess && turno ? (
          <ReprogramarTurno turno={turno} />
        ) : (
          error && (
            <div className="flex items-center justify-center">
              <div className="flex flex-col justify-center gap-2 items-center bg-white shadow-md md:w-xl w-11/12 h-44 rounded-2xl">
                <p className="md:text-3xl text-xl">Ocurrió un error</p>
                <p className="text-center">
                  Por favor intenta de nuevo más tarde
                </p>
                <Image
                  className="w-10 h-10"
                  src="/crossError.svg"
                  alt="Error"
                  width={40}
                  height={40}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
