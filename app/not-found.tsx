import Image from "next/image";
import Link from "next/link";

export default function Error404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-3.5 w-full h-full bg-[#20f9e4]">
      <Image
        src="/DoctorLupa.png"
        width={360}
        height={360}
        sizes="(max-width: 360px) 100vw, 360px"
        alt="imagen doctor"
      />
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="text-xl text-gray-950">
        Ups... No pudimos encontrar la página que buscás.
      </p>
      <Link href="/" className="text-cyan-950 hover:underline text-lg">
        Volver al Inicio
      </Link>
    </div>
  );
}
