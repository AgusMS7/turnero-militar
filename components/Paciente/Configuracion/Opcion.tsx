import { link } from "fs";
import Image from "next/image";
import Link from "next/link";

interface Props {
  link: string;
  imagen: string;
  titulo: string;
  descripcion: string;
}

export default function Opcion({ link, imagen, titulo, descripcion }: Props) {
  return (
    <Link
      href={link}
      className="w-1/2 m-auto p-5 max-md:w-full max-lg:w-4/5
      hover:scale-110 max-md:hover:scale-105 transition-transform duration-200 
      border-1 border-gray-200 shadow-md shadow-gray-500 rounded-4xl
      flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <div>
          <Image src={imagen} alt="Icono" height={60} width={60} />
        </div>
        <div className="text-start">
          <h1 className="text-2xl font-bold">{titulo}</h1>
          {descripcion && <h2 className="text-xl opacity-70">{descripcion}</h2>}
        </div>
      </div>
      <div className="max-md:hidden">
        <Image
          src={"/paciente/IngresarOpcion.png"}
          alt="Ingresar"
          width={48}
          height={48}
        />
      </div>
    </Link>
  );
}
