import CambiarClave from "@/components/Paciente/Configuracion/Cuenta/CambiarClave";
import Volver from "@/components/Paciente/Configuracion/Volver";

export default function Page() {
  return (
    <div className="w-full p-4 flex flex-col gap-10">
      <Volver link="/paciente/configuracion" />
      <div className="w-full text-center">
        <h1 className="font-semibold text-2xl text-center">
          Cambio de contraseña
        </h1>
        <CambiarClave link="/paciente/configuracion" />
      </div>
    </div>
  );
}
