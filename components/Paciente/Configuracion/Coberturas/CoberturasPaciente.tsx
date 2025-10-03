"use client";
import {
  useGetPatientByIdQuery,
  useGetPatientWithFamilyGroupQuery,
  useLazyGetPatientByIdQuery,
} from "@/app/redux/api/patient.api";
import { useSession } from "next-auth/react";
import CardCoberturaPaciente from "./CardCoberturaPaciente";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cargando from "@/components/General/Cargando";
import { errorAlCargar } from "@/components/General/ErrorAlCargar";
import SinDatos from "@/components/General/SinDatos";
import { useEffect, useState } from "react";
import { Patient } from "@/app/definitions/definitions";

export default function CoberturasPaciente() {
  const router = useRouter();
  const { data: sesion } = useSession();
  const {
    data: pacientePrincipal,
    isLoading,
    isSuccess,
    isError,
  } = useGetPatientWithFamilyGroupQuery({
    id: sesion?.user.id,
    token: sesion?.user.accessToken,
  });
  const [buscarIntegrante] = useLazyGetPatientByIdQuery();
  const [integrantesGrupoFiltrados, setIntegrantesGrupoFiltrados] = useState<
    Patient[]
  >([]);

  useEffect(() => {
    const buscarDatosPacientes = async () => {
      if (!pacientePrincipal) return;

      const todosIntegrantes = [
        pacientePrincipal,
        ...(pacientePrincipal.familyMembers || []),
      ];

      const resultados = await Promise.all(
        todosIntegrantes.map(async (integrante) => {
          const response = await buscarIntegrante({
            token: sesion?.user.accessToken,
            id: integrante.id,
          });

          if (response.data) {
            return response.data;
          }

          return null;
        })
      );

      const filtrados: Patient[] = resultados.filter(
        (integrante) =>
          integrante?.socialWorkEnrollment?.socialWork?.name != "Particular"
      ) as Patient[];
      setIntegrantesGrupoFiltrados(filtrados);
    };

    buscarDatosPacientes();
  }, [pacientePrincipal]);

  if (isLoading) {
    return <Cargando />;
  }

  if (isError) {
    errorAlCargar(
      "Ocurrio un error al obtener sus coberturas",
      "/paciente/configuracion"
    );
  }

  if (isSuccess && integrantesGrupoFiltrados) {
    return (
      <div className="w-2/3 max-lg:w-full flex flex-col gap-10 max-md:gap-5 m-auto h-full justify-between">
        <div className="flex flex-col gap-10 m-auto px-5 py-2 max-md:px-0 h-155 max-lg:h-full scroll-smooth overflow-y-auto">
          {integrantesGrupoFiltrados.length > 0 ? (
            integrantesGrupoFiltrados.map((integrante) => (
              <CardCoberturaPaciente
                key={integrante.id}
                paciente={integrante}
              />
            ))
          ) : (
            <SinDatos
              titulo="No tiene ninguna obra social asociada a ningun miembro del grupo familiar"
              texto='Puede agregar una cobertura desde el boton "Agregar cobertura"'
            />
          )}
        </div>
        <div>
          <Link
            className="flex justify-center gap-5 py-2 rounded-lg items-center bg-[#087374] w-2/5 max-md:w-4/5 m-auto text-white "
            href={"/paciente/configuracion/cobertura/formulario"}
          >
            <Image src={"/plus.svg"} alt="MAS" width={20} height={20} />
            <p>Agregar cobertura</p>
          </Link>
        </div>
      </div>
    );
  }
}
