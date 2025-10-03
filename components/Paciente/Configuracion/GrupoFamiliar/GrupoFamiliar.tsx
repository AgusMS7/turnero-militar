"use client";
import { TokenWithId } from "@/app/definitions/definitions";
import { useGetPatientWithFamilyGroupQuery } from "@/app/redux/api/patient.api";
import Cargando from "@/components/General/Cargando";
import { errorAlCargar } from "@/components/General/ErrorAlCargar";
import SinDatos from "@/components/General/SinDatos";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Opcion from "../Opcion";

export default function GrupoFamiliar() {
  const { data: sesion } = useSession();

  const tokenWithId: TokenWithId = {
    id: sesion?.user.id,
    token: sesion?.user.accessToken,
  };

  const { data, isLoading, isError, isSuccess } =
    useGetPatientWithFamilyGroupQuery(tokenWithId);

  return (
    <div className="h-full flex flex-col flex-grow">
      {/**Lista integrantes */}
      <div className="max-lg:h-full overflow-y-auto w-5/6 m-auto pb-10">
        <div className="flex flex-col max-md:w-2xs m-auto gap-5">
          {isLoading && <Cargando/>}
          {isSuccess && data.familyMembers?.length === 0 && (
            <SinDatos
              titulo="No hay integrantes en el grupo"
              texto='Para agregar integrantes utilice el boton "Agregar un integrante"'
            />
          )}
          {isSuccess &&
            (data.familyMembers?.length ?? 0) > 0 &&
            data.familyMembers?.map((integrante) => (
              <Opcion
                key={integrante.id}
                titulo={integrante.name + " " + integrante.lastName}
                descripcion=""
                imagen="/paciente/person.png"
                link={`/paciente/configuracion/grupo-familiar/formulario/${integrante.id}`}
              />
            ))}
        </div>
      </div>
      <div className="flex">
        <Link
          href={"/paciente/configuracion/grupo-familiar/formulario"}
          className="m-auto py-2 px-10 w-fit rounded-lg shadow-md shadow-gray-500 border-[#087374] border-2 
        text-center text-white text-2xl max-md:text-xl bg-[#087374] 
        cursor-pointer
        transition-transform hover:scale-105
        flex items-center gap-5
        "
        >
          <Image src={"/plus.svg"} alt="" width={25} height={25} />
          <h3>Agregar un integrante</h3>
        </Link>
      </div>
    </div>
  );
}
