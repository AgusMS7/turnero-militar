"use client";
import { Practitioner } from "@/app/definitions/definitions";

interface Props {
  practitioner: Practitioner;
}

const DatosProfesional: React.FC<Props> = ({ practitioner }) => {
  return (
    <div className="my-8">
      <div className="mb-4">
        <h2 className="text-xl font-medium mb-8">Datos del Profesional</h2>

        <div className="flex items-center gap-2 mb-4">
          <p className="font-bold">Nombre</p>
          <span className="bg-[#A4D4D4] min-w-[100px] px-4 py-1 rounded-lg border border-[#078B8C] text-center">
            {practitioner?.lastName}, {practitioner?.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <p className="font-bold">Matricula</p>
          <span className="bg-[#A4D4D4] min-w-[100px] px-4 py-1 rounded-lg border border-[#078B8C] text-center">
            {practitioner.license}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DatosProfesional;