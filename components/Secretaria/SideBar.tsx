"use client"
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-screen md:w-1/6 bg-blue-300 flex flex-col items-center justify-between py-8 text-white font-medium z-50">
      <Image src="/logo.png" height={200} width={200} alt="logo" />
      <ul className="menu w-6/7 space-y-4 text-lg p-0">
        <li>
          <Link className={`${pathname == `/secretaria` ? "menu-active" : ""} space-x-4`} href={`/secretaria`}>
            <Image src="/secretaria/iconos/home.png" width={26} height={26} alt="stats" />
            <h3>Principal</h3>
          </Link>
        </li>
        <li>
          <Link className={`${pathname == "/secretaria/medicos" ? "menu-active" : ""} space-x-4`} href="/secretaria/medicos">
            <Image src="/secretaria/iconos/doctor-white.png" width={24} height={24} alt="doctor" />
            <h3>Doctores</h3>
          </Link>
        </li>
        <li>
          <Link className={`${pathname == "/secretaria/pacientes" ? "menu-active" : ""} space-x-4`} href="/secretaria/pacientes">
            <Image src="/paciente/paciente.png" width={24} height={24} alt="patient" />
            <h3>Pacientes</h3>
          </Link>
        </li>
        <li>
          <Link className={`${pathname == `/secretaria/agenda` ? "menu-active" : ""} space-x-4`} href={`/secretaria/agenda`}>
            <Image src="/secretaria/iconos/agenda.png" width={24} height={24} alt="stats" />
            <h3>Agenda</h3>
          </Link>
        </li>
        <li>
          <Link className={`${pathname == `/secretaria/estadisticas` ? "menu-active" : ""} space-x-4`} href={`/secretaria/estadisticas`}>
            <Image src="/secretaria/iconos/stats-white.png" width={24} height={24} alt="stats" />
            <h3>Estadisticas</h3>
          </Link>
        </li>
        <li>
          <Link className={`${pathname == "/secretaria/configuracion" ? "menu-active" : ""} space-x-4`} href={`/secretaria/configuracion`}>
            <Image src="/secretaria/iconos/config-white.png" width={24} height={24} alt="config" />
            <h3>Configuracion</h3>
          </Link>
        </li>
      </ul>
      <button className="w-6/7 text-lg text-left px-5 space-x-4 flex" onClick={() => {
        localStorage.clear();
        if (window.caches) caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
        signOut();
      }}>
        <Image src="/secretaria/iconos/close-white.png" width={24} height={24} alt="exit" />
        <h3>Salir</h3>
      </button>
    </div>
  );
}