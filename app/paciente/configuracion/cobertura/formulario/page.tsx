import FormNuevaCobertura from "@/components/Paciente/Configuracion/Coberturas/Formularios/FormNuevaCobertura";
import Volver from "@/components/Paciente/Configuracion/Volver";

export default function Page() {
  return (
    <div className="w-full p-4 flex flex-col gap-10 min-h-screen">
      <Volver link="/paciente/configuracion/cobertura" />
      <div className="flex flex-col flex-grow gap-20 w-full text-center">
        <h1 className="font-semibold text-2xl text-center">
          Agregar cobertura
        </h1>
        <FormNuevaCobertura />
      </div>
    </div>
  );
}
