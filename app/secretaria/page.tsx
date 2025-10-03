import AgendaHomeSecretaria from "@/components/Secretaria/Home/AgendaHomeSecretaria";
import OpcionesHomeSecretaria from "@/components/Secretaria/Home/OpcionesHomeSecretaria";

export default function Page() {
  return (
    <div className="flex flex-col gap-5 p-10 text-center w-full min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">Panel de secretaria</h1>
      </div>
      <div>
        <AgendaHomeSecretaria />
      </div>
      <div>
        <OpcionesHomeSecretaria />
      </div>
    </div>
  );
}
