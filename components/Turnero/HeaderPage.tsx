import Link from "next/link";
import Image from "next/image";

interface Props {
  urlRetorno?: string;
  titulo: string;
}

export default function HeaderPage({ urlRetorno, titulo }: Props) {
  return (
    <nav className="flex items-center justify-between w-full p-2 border-b-2 border-gray-400 bg-[#E4ECEC]">
      {urlRetorno && (
        <Link href={urlRetorno}>
          <Image src={"/arrow-left.svg"} alt="Volver" width={12} height={12} />
        </Link>
      )}
      <span className="text-center font-normal text-lg text-black flex-grow">
        {titulo}
      </span>
    </nav>
  );
}