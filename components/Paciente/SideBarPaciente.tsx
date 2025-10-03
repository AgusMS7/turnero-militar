"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SideBarPaciente() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarHidden] = useState(false)

  return (
    <div className="z-50">
      <button type="button" className={`btn fixed ${sidebarOpen && "hidden"} lg:hidden top-0 left-0 bg-teal-800`}
      onClick={()=>setSidebarHidden(true)}>
        <Image alt="" className="absolute rotate-180" src="/desplegar.png" height={30} width={30}/>
      </button>
      <div className={`bg-teal-800 max-lg:fixed h-full w-58 flex flex-col items-center justify-between py-8 text-white font-medium
        transition-all ease-in-out ${sidebarOpen ? "translate-x-0" : "max-lg:-translate-x-full"}`}>
        <button className="fixed lg:hidden top-0 left-0 bg-teal-800 p-3 hover:cursor-pointer"
        onClick={()=>setSidebarHidden(false)}>
          <Image alt="" className="absolute" src="/arrow-left-white.svg" height={30} width={30}/>
        </button>
        <Image src="/logo.png" height={200} width={200} alt="logo" />
        <ul className="menu w-6/7 space-y-4 text-lg p-0">
          <li>
            <Link
              className={`${
                pathname == "/paciente" ? "menu-active" : ""
              } space-x-4`}
              href="/paciente"
            >
              <Image
                src="/paciente/homePaciente.png"
                width={24}
                height={24}
                alt="doctor"
              />
              <h3>Inicio</h3>
            </Link>
          </li>
          <li>
            <Link
              className={`${
                pathname == "/paciente/turno" ? "menu-active" : ""
              } space-x-4`}
              href="/paciente/turno"
            >
              <Image
                src="/secretaria/iconos/doctor-white.png"
                width={24}
                height={24}
                alt="doctor"
              />
              <h3>Pedir Turno</h3>
            </Link>
          </li>
          <li>
            <Link
              className={`${
                pathname == "/paciente/historial" ? "menu-active" : ""
              } space-x-4`}
              href="/paciente/historial"
            >
              <Image
                src="/secretaria/iconos/stats-white.png"
                width={24}
                height={24}
                alt="stats"
              />
              <h3>Historial</h3>
            </Link>
          </li>
          <li>
            <Link
              className={`${
                pathname == "/paciente/configuracion" ? "menu-active" : ""
              } space-x-4`}
              href="/paciente/configuracion"
            >
              <Image
                src="/secretaria/iconos/config-white.png"
                width={24}
                height={24}
                alt="config"
              />
              <h3>Configuracion</h3>
            </Link>
          </li>
        </ul>
        <button
          className="w-6/7 text-lg text-left px-5 space-x-4 flex hover:cursor-pointer"
          onClick={() => {
            localStorage.clear();
            if (window.caches)
              caches
                .keys()
                .then((keys) => keys.forEach((key) => caches.delete(key)));
            router.push("/");
            signOut();
          }}
        >
          <Image
            src="/secretaria/iconos/close-white.png"
            width={24}
            height={24}
            alt="exit"
          />
          <h3>Salir</h3>
        </button>
      </div>
    </div>
  );
}
