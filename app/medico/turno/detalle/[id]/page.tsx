"use client";
import { useGetOneAppointmentQuery } from "@/app/redux/api/appointment.api";
import DetalleTurno from "@/components/Paciente/Turno/DetalleTurno";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function Page() {

  const router = useRouter();

  const params = useParams();
  const { data, isLoading, isSuccess, error } = useGetOneAppointmentQuery(
    params.id as string
  );

  return (
    <div className="w-full p-4 flex flex-col gap-10 bg-[#F3F8F8] min-h-screen">
      <div onClick={()=>router.back()} className="flex items-center cursor-pointer">
          <Image src={"/arrow-back.png"} alt="Volver" height={60} width={60} />
      </div>
      <div className="text-2xl flex flex-col gap-10">
        <h1 className="font-semibold text-3xl text-center">
          Detalle del turno
        </h1>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="flex flex-col justify-center gap-2 items-center bg-white shadow-md md:w-xl w-11/12 h-44 rounded-2xl">
              <img className="w-10 h-10" src="/hourglass.svg" />
              <p className="md:text-3xl text-xl">Cargando...</p>
            </div>
          </div>
        ) : isSuccess ? (
          <DetalleTurno turno={data} />
        ) : (
          error && (
            <div className="flex items-center justify-center">
              <div className="flex flex-col justify-center gap-2 items-center bg-white shadow-md md:w-xl w-11/12 h-44 rounded-2xl">
                <p className="md:text-3xl text-xl">Ocurrio un error</p>
                <p className="text-center">
                  Por favor intenta de nuevo mas tarde
                </p>
                <img className="w-10 h-10" src="/crossError.svg" />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
