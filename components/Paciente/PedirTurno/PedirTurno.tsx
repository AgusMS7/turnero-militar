import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useLazySearchPractitionersQuery } from "@/app/redux/api/practitioner.api";
import { PractitionerCard } from "./PractitionerCard";
import { useGetProfessionaDegreeQuery } from "@/app/redux/api/professionalDegree.api";
import { ProfessionalDegree } from "@/app/definitions/definitions";
import Cargando from "@/components/General/Cargando";

export default function PedirTurno() {
  const [professionalDegreeId, setProfessionalDegreeId] = useState("");

  const [showPractitionerList, setShowPractitionerList] = useState(false);

  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const [trigger, { data: medicos = [], isLoading, isSuccess, isError }] =
    useLazySearchPractitionersQuery();

  const {
    data: professionalDegrees,
    isLoading: profDegreeLoad,
    isError: profDegreeError,
  } = useGetProfessionaDegreeQuery(token);

  const getProffesionals = () => {
    setShowPractitionerList(true);
    if (professionalDegreeId !== "" && token && !isLoading) {
      trigger({
        params: {
          professionalDegree: professionalDegreeId,
        },
        token,
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 py-10 gap-10">
      {/* Input de busqueda */}
      <div
        className={`bg-white flex flex-col justify-center shadow-md rounded-2xl py-5 items-center gap-6 w-xl max-md:w-full`}
      >
        <p
          className={`w-8/12 ${
            showPractitionerList
              ? "justify-start text-2xl"
              : "justify-center text-4xl"
          } text-center`}
        >
          <b>Turnos disponibles</b>
        </p>
        <select
          className="w-8/12 select rounded-lg text-xl text-gray-400"
          value={professionalDegreeId}
          onChange={(e) => setProfessionalDegreeId(e.target.value)}
        >
          <option>Seleccione...</option>
          {profDegreeLoad ? (
            <option disabled={true}>Cargando...</option>
          ) : profDegreeError ? (
            <option disabled={true}>Ocurrio un error</option>
          ) : (
            professionalDegrees?.map((profDegree) => (
              <option key={profDegree.id} value={profDegree.id}>
                {profDegree.profession.name}
              </option>
            ))
          )}
        </select>
        <div
          className={`mb-2.5  w-8/12 flex items-center justify-center`}
        >
          <button
            className="btn bg-[#078B8C] text-white rounded-[8px]"
            onClick={() => getProffesionals()}
          >
            Buscar Medicos
          </button>
        </div>
      </div>
      {/* Tabla */}
      {showPractitionerList ? (
        isLoading ? (
          <Cargando />
        ) : isSuccess ? (
          <div className="flex items-center justify-center flex-col h-full md:w-4/6 w-full gap-10">
            {medicos.map((practitioner) => (
              <PractitionerCard
                key={practitioner.id}
                practitioner={practitioner}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col overflow-x-auto h-full md:w-8/12 w-full gap-10">
            <div className="flex flex-col justify-center gap-2 items-center bg-white shadow-md md:w-xl w-11/12 h-44 rounded-2xl">
              <p className="md:text-3xl text-xl">Ocurrio un error</p>
              <p className="text-center">
                Por favor intenta de nuevo mas tarde
              </p>
              <img className="w-10 h-10" src="/crossError.svg" />
            </div>
          </div>
        )
      ) : (
        <span></span>
      )}
    </div>
  );
}
