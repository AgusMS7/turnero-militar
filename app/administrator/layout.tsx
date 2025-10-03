"use client";
import Sidebar from "@/components/Administrador/Sidebar";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const excludeLayout = ["/administrator/nuevoProfesional","/administrator/nuevoSecretario"]; //Las rutas en las que la sidebar no va a estar presente

  const showLayout = !excludeLayout.includes(pathname);

  return (
    <div className="flex md:flex-row flex-col">
      {showLayout && <Sidebar />}
      <div className="bg-[#0872741e] w-full min-h-screen">{children}</div>
    </div>
  );
}
