import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const AppointmentCard = ({
  id,
  day,
  month,
  practitionerName,
  practitionerLastName,
  specialty,
  hour,
}: {
  id: string;
  day: number;
  month: string;
  practitionerName: string;
  practitionerLastName: string;
  specialty: string;
  hour: string;
}) => {
  return (
    <div className="flex items-center gap-5 p-2 *:rounded-lg *:shadow-sm *:shadow-gray-400">
      {/* Sección de la fecha */}
      <div className="flex flex-col items-center justify-center bg-[#1C6C68] text-white w-20 h-20 rounded-lg flex-shrink-0">
        <span className="text-2xl font-bold">{day}</span>
        <span className="text-sm">
          {month.charAt(0).toUpperCase() + month.slice(1)}
        </span>
      </div>

      {/* Detalles del turno */}
      <Link
        href={`/paciente/turno/detalle/${id}`}
        className="flex w-full justify-between items-center hover:scale-105 transition-all h-20 px-5"
      >
        <div className="flex flex-col">
          <span className="font-semibold text-lg text-gray-800">
            {practitionerName} {practitionerLastName}
          </span>
          <span className="text-base text-gray-500">{specialty}</span>
        </div>
        <span className="text-base font-bold">{hour} hs</span>
        {/* Ícono de flecha */}
        <div className="ml-4 flex-shrink-0 max-md:hidden cursor-pointer">
          <div className="bg-[#59A29F] text-white p-2 rounded-full">
            <ChevronRight size={20} />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AppointmentCard;
