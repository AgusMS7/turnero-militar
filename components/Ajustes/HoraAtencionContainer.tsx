"use client";
import HorarioAtencionList from "../Ajustes/HorarioAtencionList";
import HorarioAtencionForm from "./HorarioAtencionForm";
import { useState } from "react";

export default function HoraAtencionContainer() {
  const [modifyFlag, setModifyFlag] = useState<boolean>(false);
  return (
    <div className="bg-[#E4ECEC] p-6">
      <span className="font-bold text-2xl">Horario de atencion</span>
      {!modifyFlag ? (
        <HorarioAtencionList setModify={setModifyFlag} />
      ) : (
        <HorarioAtencionForm setModify={setModifyFlag} />
      )}
    </div>
  );
}
