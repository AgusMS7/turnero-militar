"use client";
import { useLazySearchPractitionersQuery } from "@/app/redux/api/practitioner.api";
import { useEffect, useState } from "react";
import { Practitioner } from "@/app/definitions/definitions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetProfessionaDegreeQuery } from "@/app/redux/api/professionalDegree.api";

export default function BuscadorMedico() {
  const router = useRouter();
  const [apellido, setApellido] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [imageError, setImageError] = useState(false);
  const [trigger, { data: medicos = [], isFetching }] =
    useLazySearchPractitionersQuery();

  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const {
    data: professionalDegrees,
    isLoading: profDegreeLoad,
    isError: profDegreeError,
  } = useGetProfessionaDegreeQuery(token);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (token) {
        trigger({
          params: {
            lastName: apellido,
            professionalDegree: especialidad,
          },
          token,
        });
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [apellido, especialidad, trigger]);

  return (
    <div className="w-full h-full p-6 py-10 space-y-4">
      <h1 className="text-4xl font-semibold">Staff de Medicos</h1>
      {/* Input de busqueda */}
      <div className="flex justify-center gap-6">
        <input
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          placeholder="Apellido..."
          className="input rounded-lg text-2xl focus:outline-none"
        />
        <select
          onChange={(e) => setEspecialidad(e.target.value)}
          value={especialidad}
          className="select rounded-lg text-2xl focus:outline-none"
        >
          <option value={""}>Especialidad...</option>
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
      </div>
      <div className="flex gap-2 items-end">
        <Image
          src="/secretaria/estetoscopio.svg"
          height={48}
          width={48}
          alt="estetoscopio"
        />
        <p className="text-2xl">{medicos.length}</p>
        <h2 className="text-xl text-black/50">Medicos Encontrados</h2>
      </div>
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="text-xl text-gray-500 bg-gray-200 rounded-4xl text-center">
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Dias Laborales</th>
              <th>Especialidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {isFetching ? (
              <tr>
                <td colSpan={5}>Cargando...</td>
              </tr>
            ) : medicos.length === 0 ? (
              <tr>
                <td colSpan={5}>Sin resultados</td>
              </tr>
            ) : (
              medicos.map((medico: Practitioner) => (
                <tr
                  key={medico.id}
                  className="text-center border border-gray-200"
                >
                  <td className="text-lg py-3 items-center">
                    <div className="flex items-center gap-4">
                      {medico.urlImg && !imageError ? (
                        <img
                          src={medico.urlImg}
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
                        {medico.name} {medico.lastName}
                      </h1>
                    </div>
                  </td>
                  <td>
                    <div>
                      <h3 className="text-lg">{medico.phone}</h3>
                      <h3 className="font-semibold text-blue-500">
                        {medico.email}
                      </h3>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-1 justify-center">
                      <div className={`text-lg ${medico.appointmentSlots?.find((slot)=>slot.day == "Monday" && !slot.unavailable) ? "text-blue-400 bg-blue-200" : "text-gray-400 bg-gray-300"} p-2 px-4 rounded-4xl`}>
                        L
                      </div>
                      <div className={`text-lg ${medico.appointmentSlots?.find((slot)=>slot.day == "Tuesday" && !slot.unavailable) ? "text-blue-400 bg-blue-200" : "text-gray-400 bg-gray-300"} p-2 px-4 rounded-4xl`}>
                        M
                      </div>
                      <div className={`text-lg ${medico.appointmentSlots?.find((slot)=>slot.day == "Wednesday" && !slot.unavailable) ? "text-blue-400 bg-blue-200" : "text-gray-400 bg-gray-300"} p-2 px-4 rounded-4xl`}>
                        M
                      </div>
                      <div className={`text-lg ${medico.appointmentSlots?.find((slot)=>slot.day == "Thursday" && !slot.unavailable) ? "text-blue-400 bg-blue-200" : "text-gray-400 bg-gray-300"} p-2 px-4 rounded-4xl`}>
                        J
                      </div>
                      <div className={`text-lg ${medico.appointmentSlots?.find((slot)=>slot.day == "Friday" && !slot.unavailable) ? "text-blue-400 bg-blue-200" : "text-gray-400 bg-gray-300"} p-2 px-4 rounded-4xl`}>
                        V
                      </div>
                    </div>
                  </td>
                  <td className="text-lg font-semibold">
                    {medico.professionalDegree
                      ? medico.professionalDegree.profession.name
                      : "Sin datos"}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-info"
                        onClick={() =>
                          router.push(`/secretaria/medico/${medico.id}`)
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
      </div>
    </div>
  );
}
