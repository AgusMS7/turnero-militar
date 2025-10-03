import { Appointment } from "@/app/definitions/definitions";
import { corregirFecha } from "@/app/utils/helperFunctions";
import Link from "next/link";

interface Props {
  data: Appointment;
}
export default function BuscarTurnoList({data}: Props) {
  return (
    <li className="border-b border-[#078B8C] p-1">
      <Link href={`/turnero/${data.id}`} className="hover:bg-[#078B8C] hover:text-white">
        <div className="flex flex-col items-start justify-between">
          <span>{`Paciente: ${data.patient.name} ${data.patient.lastName}`}</span>
          <span>{`Fecha: ${corregirFecha(data.date)} - ${data.hour} hs`}</span>
        </div>
      </Link>
    </li>
  );
}
