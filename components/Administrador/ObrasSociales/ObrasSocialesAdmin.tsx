"use client";
import { useGetAllSocialWorksQuery } from "@/app/redux/api/socialWork.api";
import Cargando from "@/components/General/Cargando";
import { errorAlCargar } from "@/components/General/ErrorAlCargar";
import { useSession } from "next-auth/react";
import ObraSocialCard from "./ObraSocialCard";
import { useEffect, useState } from "react";
import { SocialWork } from "@/app/definitions/definitions";
import Image from "next/image";
import Link from "next/link";

export default function ObrasSocialesAdmin() {
  const { data: sesion } = useSession();
  const { data, isLoading, isError, isSuccess } = useGetAllSocialWorksQuery(
    sesion?.user.accessToken
  );
  const [buscador, setBuscador] = useState("");
  const [obrasMostradas, setObrasMostradas] = useState<SocialWork[]>([]);

  useEffect(() => {
    const todasObras = data?.socialWorks;
    if (todasObras) {
      if (buscador) {
        const obrasFiltradas = todasObras.filter((obra) =>
          obra.name?.toLowerCase().startsWith(buscador.toLowerCase())
        );

        return setObrasMostradas(obrasFiltradas);
      }

      return setObrasMostradas(todasObras);
    }
  }, [buscador, data]);

  if (isLoading) {
    return <Cargando />;
  }

  if (isError) {
    errorAlCargar(
      "Ocurrio un error al obtener las obras sociales",
      "/administrator"
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex justify-between items-center mx-10">
          <div className="bg-gray-300 rounded-2xl py-2 px-5 w-1/3 flex gap-2">
            <Image src={"/search_black.svg"} alt="" width={20} height={20} />
            <input
              className="w-full focus:outline-none"
              value={buscador}
              onChange={(e) => setBuscador(e.target.value)}
              placeholder="Buscar"
              type="text"
            />
          </div>
          <div>
            <Link
              className="bg-[#078B8C] px-25 py-2 text-white font-bold rounded-xl flex gap-2"
              href={"/administrator/obrasSociales/formulario"}
            >
              Nueva obra social
              <Image src={"/plus.svg"} alt="" height={15} width={15}/>
            </Link>
          </div>
        </div>
        <div className="text-center flex flex-col gap-5">
          <div className="grid grid-cols-5 [&_h1]:font-bold">
            <div>
              <h1>Nombre</h1>
            </div>
            <div>
              <h1>Fecha de carga</h1>
            </div>
            <div>
              <h1>Telefono</h1>
            </div>
            <div>
              <h1>Sitio Web</h1>
            </div>
            <div>
              <h1>Acciones</h1>
            </div>
          </div>
          {obrasMostradas.length > 0 &&
            obrasMostradas.map((obraSocial) => (
              <ObraSocialCard key={obraSocial.id} obraSocial={obraSocial} />
            ))}
        </div>
      </div>
    );
  }
}
