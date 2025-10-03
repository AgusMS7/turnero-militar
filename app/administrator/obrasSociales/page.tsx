import ObrasSocialesAdmin from "@/components/Administrador/ObrasSociales/ObrasSocialesAdmin";
import Volver from "@/components/Paciente/Configuracion/Volver";

export default function Page() {
  return (
    <div className="w-full p-4 flex flex-col min-h-screen">
      <Volver link="/administrator" />
      <div className="flex flex-col gap-20 w-full text-center">
        <h1 className="font-semibold text-2xl text-center">Obras Sociales</h1>
        <ObrasSocialesAdmin />
      </div>
    </div>
  );
}
