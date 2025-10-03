"use client";
import { Appointment, TokenWithEntity } from "@/app/definitions/definitions";
import { useEffect, useState } from "react";
import TurnoAgendaHomeSecretaria from "./TurnoAgendaHomeSecretaria";
import Link from "next/link";
import { useLazyGetAllAppointmentsBySpecificDayQuery } from "@/app/redux/api/appointment.api";
import { useSession } from "next-auth/react";
import Cargando from "@/components/General/Cargando";

export default function AgendaHomeSecretaria() {
  const { data: sesion } = useSession();

  const [fechaAgenda, setFechaAgenda] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [trigger, { data: turnos, isFetching, isSuccess, isError }] =
    useLazyGetAllAppointmentsBySpecificDayQuery();

  const [turnosOrdenados, setTurnosOrdenados] = useState<Appointment[]>([]);

  const ordenarTurnos = () => {
    const normalizarHoras = (hora: string) => {
      const [h, minutos] = hora.split(":").map(Number);
      return h * 60 + minutos;
    };

    if (turnos?.turns) {
      let turnosOrd = [...turnos.turns];

      turnosOrd.sort(
        (a, b) => normalizarHoras(a.hour) - normalizarHoras(b.hour)
      );

      return setTurnosOrdenados(turnosOrd);
    }
  };

  useEffect(() => {
    const timeOut = setTimeout(async () => {
      //Llamada al back ACA
      const tokenWithEntity: TokenWithEntity = {
        token: sesion?.user.accessToken,
        entity: {
          date: fechaAgenda,
        },
      };
      await trigger(tokenWithEntity);
    }, 1000);

    return () => clearTimeout(timeOut);
  }, [fechaAgenda]);

  useEffect(() => {
    if (turnos?.turns) {
      ordenarTurnos();
    }
  }, [turnos]);

  return (
    <div
      className="bg-gray-100 w-full m-auto p-10 
    flex flex-col gap-5
     *:p-2"
    >
      <div className="flex justify-between items-center border-b-gray-300 border-b-2">
        <h1 className="font-bold text-xl text-start">Agenda del hospital</h1>
        <input
          value={fechaAgenda}
          onChange={(e) => setFechaAgenda(() => e.target.value)}
          className="font-semibold bg-gray-300 p-2 rounded-lg text-xl focus:outline-none"
          type="date"
        />
      </div>
      {/**Tabla */}
      <div className="flex flex-col gap-5 overflow-y-auto">
        {/**Cabecera */}
        <div className="grid grid-cols-5 font-bold text-xl ">
          <div>
            <h2>Hora</h2>
          </div>
          <div>
            <h2>Paciente</h2>
          </div>
          <div>
            <h2>Profesional</h2>
          </div>
          <div>
            <h2>Estado</h2>
          </div>
          <div>
            <h2></h2>
          </div>
        </div>
        {isFetching ? (
          <Cargando />
        ) : isSuccess ? (
          <div className="flex flex-col gap-4 h-40">
            {turnosOrdenados.length > 0 ? (
              turnosOrdenados.map((turno) => (
                <TurnoAgendaHomeSecretaria key={turno.id} turno={turno} />
              ))
            ) : (
              <p>No hay turnos para la fecha seleccionada</p>
            )}
          </div>
        ) : (
          isError && (
            <p className="text-red-500">
              Ocurrio un error al cargar los turnos
            </p>
          )
        )}
        {/**Cuerpo */}
      </div>
      <div className="">
        <Link
          className="bg-blue-300 py-4 px-15 font-bold rounded-xl text-xl shadow"
          href={"/secretaria/agenda"}
        >
          Ver más
        </Link>
      </div>
    </div>
  );
}
