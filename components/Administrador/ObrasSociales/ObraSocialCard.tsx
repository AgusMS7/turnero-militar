import { SocialWork } from "@/app/definitions/definitions";
import Image from "next/image";
import Link from "next/link";
import BotonDeleteCardObraSocial from "./BotonDeleteCardObraSocial";

interface Props {
  obraSocial: SocialWork;
}

export default function ObraSocialCard({ obraSocial }: Props) {
  return (
    <div className="w-full grid grid-cols-5 bg-[#078c8c44] py-5 shadow shadow-gray-400 items-center rounded-2xl font-bold">
      <div>
        <h1>{obraSocial.name}</h1>
      </div>
      <div>
        <h1>{new Date(obraSocial.createdAt).toLocaleDateString()}</h1>
      </div>
      <div>
        <h1>{obraSocial.phone}</h1>
      </div>
      <div>
        <Link
          className="bg-white text-[#087374] p-3 m-auto rounded-md flex justify-center gap-2 items-center w-1/4"
          href={obraSocial.website ? obraSocial.website : ""}
        >
          <h1>Ir</h1>
          <Image
            className="rotate-180"
            src={"/arrow-back.png"}
            alt="Flecha"
            width={20}
            height={20}
          />
        </Link>
      </div>
      <div className="flex justify-center-safe gap-3 items-center">
        <Link href={`/administrator/obrasSociales/formulario/${obraSocial.id}`}>
          <Image
            src={"/edit-square-full-salud-colorsvg.svg"}
            alt="Mod"
            height={25}
            width={25}
          />
        </Link>
        <BotonDeleteCardObraSocial obraSocial={obraSocial}/>
      </div>
    </div>
  );
}
