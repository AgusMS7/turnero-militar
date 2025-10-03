import SideBar from "@/components/Secretaria/SideBar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen">
      {/* sideBar */}
      <SideBar/>
      <div className="ml-[16.6667%] w-[83.3333vw] h-screen overflow-auto">{children}</div>
    </div>
  );
}
