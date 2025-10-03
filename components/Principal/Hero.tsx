import LinkBtn from "@/components/RootComponents/LinkBtn";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="hero bg-teal-700 rounded-2xl shadow-2xl py-5">
      <div className="hero-content flex-col lg:flex-row-reverse w-full justify-around">
        <Image
          src="/principal/militar.png"
          alt="logo"
          width={320}
          height={320}
          className="max-w-xs sm:max-w-sm border-2 w-full bg-white rounded-full h-auto"
        />
        <div className="text-center lg:text-left">
          <h1 className="text-4xl sm:text-6xl font-bold">Turnero Hospital Militar</h1>
          <p className="py-6 text-xl sm:text-3xl text-white">
            Gestioná tus turnos médicos de forma rápida y sencilla
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 justify-center lg:justify-start">
            <LinkBtn url={"/login"} texto={"Iniciar Sesion"} />
            <LinkBtn url={"/register"} texto={"Crear Cuenta"} />
          </div>
        </div>
      </div>
    </div>
  );
}
