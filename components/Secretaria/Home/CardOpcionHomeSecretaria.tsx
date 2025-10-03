import Link from "next/link";
import Image from "next/image";

interface Props {
  titulo: string;
  icono: string;
  link: string;
}

export default function CardOpcionHomeSecretaria({
  titulo,
  icono,
  link,
}: Props) {
  return (
    <Link className="flex flex-col items-center w-1/4 m-auto hover:scale-110 transition" href={link}>
      <div className="border-4 border-blue-300 rounded-full p-4">
        <Image src={icono} alt="" height={50} width={50} />
      </div>
      <h2 className="font-semibold text-lg">{titulo}</h2>
    </Link>
  );
}
