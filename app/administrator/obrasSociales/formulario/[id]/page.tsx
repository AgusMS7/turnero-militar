import FormModificarObraSocial from "@/components/Administrador/ObrasSociales/formularios/FormModificarObraSocial";
import Volver from "@/components/Paciente/Configuracion/Volver";

export default function Page() {
  return (
    <div className="w-full p-4 flex flex-col gap-10">
      <Volver link="/administrator/obrasSociales" />
      <div className="flex flex-col bg-[#078c8c44] shadow shadow-gray-500 gap-10 min-h-max w-4/5 m-auto py-10 text-center">
        <h1 className="font-semibold text-2xl text-center">
          Modificar obra social
        </h1>
        <FormModificarObraSocial />
      </div>
    </div>
  );
}
