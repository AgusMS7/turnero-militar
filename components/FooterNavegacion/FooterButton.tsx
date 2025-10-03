"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface FooterButtonTypes {
  tipoBoton: string;
  rol: string;
}

interface IconoProps {
  tipo: string;
}

function Icono({ tipo }: IconoProps) {
  switch (tipo) {
    case "agenda":
      return <Image src={"/agenda.svg"} alt="agenda" width={28} height={28}/>;
    case "turnos":
      return <Image src={"/turnos.svg"} alt="turnos" width={28} height={28} />;
    case "ajustes":
      return <Image src={"/ajustes.svg"} alt="ajustes" width={28} height={28}/>;
    case "estadisticas":
      return <Image src={"/estadisticas.svg"} alt="estadisticas" width={28} height={28}/>;
    case "notificaciones":
      return <Image src={"/notificaciones.svg"} alt="notificaciones" width={28} height={28}/>;
    default:
      return <Image src={"/error.svg"} alt="error" width={28} height={28} />;
  }
}

export default function FooterButton({ tipoBoton, rol }: FooterButtonTypes) {
  const pathname = usePathname();
  const roles = [
    "paciente",
    "medico",
    "admin",
    "secretario",
    "auxiliar",
    "institucional",
  ];
  let botonPath = "";

  if (roles.includes(rol)) {
    botonPath = `/${rol}/`;
  }

  switch (tipoBoton) {
    case "agenda":
      botonPath += "agenda";
      break;
    case "turnos":
      botonPath += "turnos";
      break;
    case "ajustes":
      botonPath += "ajustes";
      break;
    case "estadisticas":
      botonPath += "estadisticas";
      break;
    case "notificaciones":
      botonPath += "notificaciones";
      break;
    default:
      botonPath = "/error";
  }

  return (
    <Link href={botonPath}>
      <div className="flex flex-col items-center">
        <Icono tipo={tipoBoton} />
        <span className="text-black">
          {tipoBoton.substring(0, 1).toUpperCase() + tipoBoton.substring(1)}
        </span>
      </div>
    </Link>
  );
}