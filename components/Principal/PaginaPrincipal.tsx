import Hero from "./Hero";
import Card from "./Card";

export default function PaginaPrincipal() {
  return (
    <div className="flex flex-col items-center justify-center bg-teal-900 min-h-screen p-2 sm:p-6 gap-5">
      <Hero />
      <div className="w-full space-y-10 bg-stone-50 p-4 sm:p-10 rounded-2xl shadow-2xl">
        <h2 className="text-3xl sm:text-5xl text-center">Como funciona el Sistema</h2>
        <div className="flex flex-col sm:flex-row justify-around items-center gap-8">
          <Card url="/principal/registrarse.svg" text="1. Registrate" />
          <Card
            url="/principal/calendario.svg"
            text="2. Elegi especialidad y profesional"
          />
          <Card url="/principal/completado.svg" text="3. Reserva tu turno" />
        </div>
      </div>
    </div>
  );
}
