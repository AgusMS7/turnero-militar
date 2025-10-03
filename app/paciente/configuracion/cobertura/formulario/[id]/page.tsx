import FormModificarCobertura from "@/components/Paciente/Configuracion/Coberturas/Formularios/FormModificarCobertura";
import Volver from "@/components/Paciente/Configuracion/Volver";

export default function Page() {
  return (
    <div className="w-full p-4 flex flex-col min-h-screen gap-10">
      <Volver link="/paciente/configuracion/cobertura" />
      <div className="flex flex-col w-full flex-grow text-center">
        <h1 className="font-semibold text-2xl text-center">
          Modificar cobertura
        </h1>
        <FormModificarCobertura />
      </div>
    </div>
  );
}
