"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLazyGetAllPatientsQuery } from "@/app/redux/api/patient.api";
import Link from "next/link";

const Limit = 6;

export default function BuscadorPaciente() {
  const router = useRouter();
  const [patientName, setPatientName] = useState("");
  const [patientDni, setPatientDni] = useState("");
  const [imageError, setImageError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [trigger, { data: patients, isLoading, isError, isSuccess }] =
    useLazyGetAllPatientsQuery();

  const { data: session } = useSession();
  const token = session?.user.accessToken;

  useEffect(() => {
    setCurrentPage(1);
  }, [patientName, patientDni, trigger]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (token) {
        trigger({
          token,
          patientName,
          patientDni,
          page: currentPage.toString(),
          limit: Limit.toString(),
        });
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [patientName, patientDni, currentPage, trigger]);

  return (
    <div className="w-full h-full p-6 py-10 space-y-4">
      <h1 className="text-4xl font-semibold">Pacientes</h1>
      {/* Input de busqueda */}
      <div className="flex justify-center gap-6">
        <input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Nombre..."
          className="input rounded-lg text-2xl focus:outline-none"
        />
        <input
          type="text"
          value={patientDni}
          onChange={(e) => setPatientDni(e.target.value)}
          placeholder="Dni..."
          className="input rounded-lg text-2xl focus:outline-none"
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-end">
          <Image
            className=" bg-gray-200 rounded-xl"
            src="/user-gray.svg"
            height={48}
            width={48}
            alt="estetoscopio"
          />
          <p className="text-2xl">{patients?.total}</p>
          <h2 className="text-xl text-black/50">Pacientes encontrados</h2>
        </div>
        <div>
          <Link
            href={"/secretaria/pacientes/formulario"}
            className="btn btn-info text-lg"
          >
            + Nuevo paciente
          </Link>
        </div>
      </div>
      {/* Tabla */}
      <div className="overflow-x-auto flex flex-col gap-1">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="text-xl text-gray-500 bg-gray-200 rounded-4xl text-center">
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Dni</th>
              <th>Grupo Familiar</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {isLoading ? (
              <tr>
                <td colSpan={5}>Cargando...</td>
              </tr>
            ) : patients?.patients.length === 0 ? (
              <tr>
                <td colSpan={5}>Sin resultados</td>
              </tr>
            ) : (
              patients?.patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="text-center border border-gray-200"
                >
                  <td className="text-lg py-3 items-center">
                    <div className="flex items-center gap-4">
                      {patient.urlImg && !imageError ? (
                        <img
                          src={patient.urlImg}
                          height={48}
                          width={48}
                          alt="foto"
                          onError={() => setImageError(true)}
                          className="rounded-[40px] border border-blue-300 w-12 h-12"
                        />
                      ) : (
                        <img
                          src="/logo.png"
                          height={48}
                          width={48}
                          alt="foto"
                          className="rounded-[40px] border border-blue-300 w-12 h-12"
                        />
                      )}
                      <h1 className="text-start">
                        {patient.name} {patient.lastName}
                      </h1>
                    </div>
                  </td>
                  <td>
                    <div>
                      {patient.phone || patient.email ? (
                        <div>
                          <h3 className="text-lg">{patient.phone}</h3>
                          <h3 className="font-semibold text-blue-500">
                            {patient.email}
                          </h3>
                        </div>
                      ) : (
                        <h3 className="text-lg">Sin datos de contacto</h3>
                      )}
                    </div>
                  </td>
                  <td className="text-lg font-semibold">
                    {patient.dni ? patient.dni : "Sin datos"}
                  </td>
                  <td className="text-lg font-semibold">
                    {patient.familyGroup
                      ? patient.familyGroup.familyGroupName
                      : "Sin Familia"}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-info"
                        onClick={() =>
                          router.push(`/secretaria/paciente/${patient.id}`)
                        }
                      >
                        Opciones
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="w-full flex flex-row justify-center items-center mt-0.5 gap-4 mb-1.5">
          <button
            className={`btn w-10 relative ${
              currentPage <= 1 ? "bg-gray-500" : "btn-info"
            }`}
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
          >
            <img className="absolute" src="/arrow-left-white.svg" />
          </button>
          <div>
            {currentPage}-
            {Math.ceil(patients?.total ? patients?.total / Limit : 1)}
          </div>
          <button
            className={`btn w-10 relative ${
              currentPage >=
              (patients?.total
                ? Math.ceil(patients?.total ? patients?.total / Limit : 1)
                : -1)
                ? "bg-gray-500"
                : "btn-info"
            }`}
            disabled={
              currentPage >=
              (patients?.total
                ? Math.ceil(patients?.total ? patients?.total / Limit : 1)
                : -1)
            }
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
          >
            <img className="absolute" src="/arrow-right-white.svg" />
          </button>
        </div>
      </div>
    </div>
  );
}
