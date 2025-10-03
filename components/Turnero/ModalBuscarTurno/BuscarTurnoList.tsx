import { Appointment } from "@/app/definitions/definitions";
import BuscarTurnoListItem from "./BuscarTurnoListItem";

interface Props {
  resultQuery: {
    isError: boolean;
    isLoading: boolean;
    appointments: Appointment[]|undefined;
  };
}

export default function BuscarTurnoList({resultQuery}: Props) {
  if(resultQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-gray-500">Buscando Turnos...</p>
      </div>
    );
  }
  if(resultQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-red-500">No hay turnos disponibles</p>
      </div>
    );
  }
  if (resultQuery.appointments === undefined) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-gray-500">No hay turnos disponibles</p>
      </div>
    );
  } else if (resultQuery.appointments.length <= 3 && resultQuery.appointments.length > 0) {
    return (
      <ul className="menu rounded-box w-full shadow-lg bg-base-100 border border-base-300">
        {resultQuery.appointments.map((item, index) => (
          <BuscarTurnoListItem key={index} data={item} />
        ))}
      </ul>
    );
  } else {
    return (
      <ul className="menu menu-vertical flex-nowrap rounded-box w-full h-64 overflow-y-scroll shadow-lg bg-base-100 border border-base-300">
        {resultQuery.appointments.map((item, index) => (
          <BuscarTurnoListItem key={index} data={item} />
        ))}
      </ul>
    );
  }
}
