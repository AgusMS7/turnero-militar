import { SetStateAction } from "react";
import HorarioAtencionListItem from "./HorarioAtencionListItem";

interface Props{
  setModify:React.Dispatch<SetStateAction<boolean>>
}

export default function HorarioAtencionList({setModify}:Props) {
  return (
    <div className="space-y-2 p-4 rounded-lg bg-white mt-4">
      <div className="flex justify-end">
        <button onClick={()=>setModify(true)} className="btn rounded-lg text-[#48a7a8] border-2 border-[#48a7a8]">
          Modificar
        </button>
      </div>
      <div className="space-y-2">
        <HorarioAtencionListItem
          dia={"Lunes"}
          horaInicio={"09:30"}
          horaFin={"18:30"}
        />
        <HorarioAtencionListItem
          dia={"Martes"}
          horaInicio={"09:30"}
          horaFin={"18:30"}
        />
        <HorarioAtencionListItem
          dia={"Miercoles"}
          horaInicio={"09:30"}
          horaFin={"18:30"}
        />
        <HorarioAtencionListItem
          dia={"Jueves"}
          horaInicio={"09:30"}
          horaFin={"18:30"}
        />
        <HorarioAtencionListItem
          dia={"Viernes"}
          horaInicio={"09:30"}
          horaFin={"18:30"}
        />
      </div>
      <div>
        <span className="font-medium text-gray-700">Duracion del turno</span>
        <div>
          <span className="btn border-2 bg-inherit font-normal text-lg text-gray-500">30 minutos</span>
        </div>
      </div>
    </div>
  );
}
