import SidebarMedico from "@/components/Medico/SidebarMedico";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#E4ECEC] flex flex-row  w-full min-h-screen 
    ">
        <SidebarMedico />
        <main className="w-full">{children}</main>
    </div>
  );
}