"use client";
import Opcion from "@/components/Paciente/Configuracion/Opcion";
import Volver from "@/components/Paciente/Configuracion/Volver";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data } = useSession();
  const router = useRouter();

  const handleCerrarSesion = () => {
    router.push("/");
    signOut();
  };

  return (
    <div className="w-full p-4 flex flex-col">
      <Volver link="/paciente" />
      <div className="w-full text-center">
        <h1 className="font-semibold text-3xl text-center">
          {data?.user.name} {data?.user.lastName}
        </h1>
        <div className="my-20 flex flex-col gap-10 max-md:gap-5">
          <Opcion
            link="/paciente/configuracion/misDatos"
            imagen="/paciente/person.png"
            titulo="Mis datos"
            descripcion="Ver informacion personal"
          />
          <Opcion
            link="/paciente/configuracion/grupo-familiar"
            imagen="/paciente/grupoFamiliar.png"
            titulo="Grupo familiar"
            descripcion="Administra tu grupo familiar"
          />
          <Opcion
            link="/paciente/configuracion/cobertura"
            imagen="/paciente/cobertura.png"
            titulo="Cobertura"
            descripcion="Administra tus coberturas"
          />
          <Opcion
            link="/paciente/configuracion/cuenta"
            imagen="/paciente/cuenta.png"
            titulo="Cuenta"
            descripcion="Cambio de contraseña"
          />
        </div>
      </div>
      <div className="flex">
        <button
          className="m-auto py-2 px-10 w-fit shadow-md shadow-gray-500 border-[#087374] border-2 
        text-center text-[#087374] text-2xl 
        cursor-pointer hover:bg-[#087374] hover:text-white
        transition-transform hover:scale-105"
          onClick={() => handleCerrarSesion()}
        >
          <h3>Cerrar sesion</h3>
        </button>
      </div>
    </div>
  );
}