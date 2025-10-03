import NuevoIntegranteGrupo from "@/components/Paciente/Configuracion/GrupoFamiliar/NuevoIntegranteGrupo";
import Volver from "@/components/Paciente/Configuracion/Volver";

export default function Page() {
  return (
    <div className="w-full p-4 flex flex-col min-h-screen">
      <Volver link="/paciente/configuracion/grupo-familiar" />
      <div className="w-full text-center flex flex-col flex-grow gap-10">
        <h1 className="font-semibold text-3xl text-center">Nuevo integrante</h1>
        <NuevoIntegranteGrupo />
      </div>
    </div>
  );
}
