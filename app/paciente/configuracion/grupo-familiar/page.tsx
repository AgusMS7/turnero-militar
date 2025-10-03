import GrupoFamiliar from "@/components/Paciente/Configuracion/GrupoFamiliar/GrupoFamiliar";
import Volver from "@/components/Paciente/Configuracion/Volver";

export default function Page() {
  return (
    <div className="w-full p-4 max-md:px-0 flex min-h-screen flex-col">
      <Volver link="/paciente/configuracion" />
      <div className="w-full text-center flex flex-col flex-grow h-fit gap-10">
        <h1 className="font-semibold text-3xl text-center">Grupo familiar</h1>
        <GrupoFamiliar/>
      </div>
    </div>
  );
}
