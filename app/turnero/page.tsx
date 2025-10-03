"use client";
import Image from "next/image";
import { useGetOnePractitionerByNameAndLicenseQuery } from "../redux/api/practitioner.api";
import HeaderPage from "@/components/Turnero/HeaderPage";
import DetalleMedicoSkeleton from "@/components/Skeletons/DetalleMedicoSkeleton";
import VistaErrorGenerico from "@/components/ErrorComponents/VistaErrorGenerico";
import DetalleMedico from "@/components/Turnero/DetalleMedico";
import React, { use } from "react";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ name: string; license: string }>;
}) {
  const { name, license } = use(searchParams) || {};
  const {
    data: practitioner,
    isLoading,
    isError,
    isSuccess,
  } = useGetOnePractitionerByNameAndLicenseQuery({
    name: name || "",
    license: license || "",
  });
  if (isLoading) {
    return (
      <div className="text-black">
        <HeaderPage titulo="Detalle Medico" />
        <div className="px-3">
          <div>
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto"
            />
          </div>
          <DetalleMedicoSkeleton />
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <VistaErrorGenerico
        titulo={"No existe un médico registrado con esos parámetros"}
        cuerpo={
          "Asegurate de que la URL sea la correcta o que los parametros sean validos"
        }
        tituloHeader={"Detalle Medico"}
      />
    );
  }
  if (isSuccess) {
    return (
      <div className="text-black">
        <HeaderPage titulo="Detalle Medico" />
        <div className="px-3">
          <div>
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto"
            />
          </div>
          <DetalleMedico practitioner={practitioner} />
        </div>
      </div>
    );
  }
}
