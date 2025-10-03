import Image from "next/image";
import Link from "next/link";

interface Props {
  link: string;
}

export default function Volver({ link }: Props) {
  return (
    <div className="flex items-center max-lg:hidden">
      <Link href={link}>
        <Image src={"/arrow-back.png"} alt="Volver" height={60} width={60} />
      </Link>
    </div>
  );
}
