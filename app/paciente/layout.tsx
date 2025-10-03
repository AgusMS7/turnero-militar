import SideBarPaciente from "@/components/Paciente/SideBarPaciente";
import SideBar from "@/components/Secretaria/SideBar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen">
      {/* sideBar */}
      <SideBarPaciente/>
      <div className="w-full h-screen overflow-auto">{children}</div>
    </div>
  );
}
