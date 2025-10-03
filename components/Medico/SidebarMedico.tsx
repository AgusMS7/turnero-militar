"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SidebarMedico() {
  const pathname = usePathname();
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);

  return (
      <div className="z-50">
          <button className="btn fixed top-0 left-0 lg:hidden bg-teal-800 opacity-70" onClick={() => setIsSidebarHidden(!isSidebarHidden)}>
              <img className="absolute" src="/arrow-right-white.svg" />
          </button>
          <div className={`max-lg:fixed top-0 left-0 flex flex-col justify-between h-full w-56 bg-teal-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out 
              ${isSidebarHidden ? "translate-x-0" : "max-lg:-translate-x-full"}`}>
              <button className="btn fixed border-none top-0 left-0 lg:hidden bg-teal-800 shadow-xs" onClick={() => setIsSidebarHidden(!isSidebarHidden)
              }><Image alt="" height={40} width={40} className="absolute" src="/arrow-left-white.svg" />
              </button>
              <Image className="mx-auto" src="/logo.png" height={200} width={200} alt="logo" />
              <div className="flex flex-col gap-2">
                  <Link
                      href="/medico/home"
                      className={`btn font-thin w-50 text-lg flex flex-row justify-start gap-5 text-white border-none shadow-none hover:bg-black ${pathname == "/medico/home" ? "bg-black" : "bg-transparent"}`}
                  >
                      <img src="/home-white.svg" /><p>Principal</p>
                  </Link>
                  <Link
                      href="/medico"
                      className={`btn font-thin w-50 text-lg flex flex-row justify-start gap-5 text-white border-none shadow-none  hover:bg-black ${pathname == "/medico" ? "bg-black" : "bg-transparent"}`}>
                      <img src="/agenda_nodots_white.svg" /><p>Agenda</p>
                  </Link>
                  <Link
                      href="/medico/historial"
                      className={`btn font-thin w-50 text-lg flex flex-row justify-start gap-5 text-white border-none shadow-none  hover:bg-black ${pathname == "/medico/historial" ? "bg-black" : "bg-transparent"}`}>
                      <img src="/calender-events-white.svg" /><p>Historial</p>
                  </Link>
                  <Link
                      href="/medico/configuracion"
                      className={`btn font-thin w-50 text-lg flex flex-row justify-start gap-5 text-white border-none shadow-none  hover:bg-black ${pathname == "/medico/ajustes" ? "bg-black" : "bg-transparent"}`}>
                      <img src="/ajustes_white.svg" /><p>Configuracion</p>
                  </Link>
              </div>
              <button className={`btn font-thin bg-transparent w-50 text-lg flex flex-row justify-start gap-5 text-white border-none shadow-none `} onClick={() => {
                  localStorage.clear();
                  if (window.caches) caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
                  signOut();
              }}><img src="/logout-white.svg" className="w-6" /><h3>Salir</h3></button>
          </div>
      </div>
  );
}
