import CoberturasPaciente from "@/components/Paciente/Configuracion/Coberturas/CoberturasPaciente";
import Volver from "@/components/Paciente/Configuracion/Volver";

export default function Page() {
  return (
    <div className="w-full p-3 flex flex-col min-h-screen">
      <Volver link="/paciente/configuracion" />
      <div className="flex flex-col gap-20 max-md:gap-5 w-full flex-grow text-center h-fit">
        <h1 className="font-semibold text-2xl text-center h-full">Coberturas</h1>
        <CoberturasPaciente />
      </div>
    </div>
  );
}
