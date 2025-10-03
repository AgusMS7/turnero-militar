import FormPacienteSecretaria from "@/components/Secretaria/FormPacienteSecretaria";

export default function Page() {
  return (
    <div className="w-full p-4 flex flex-col min-h-screen">
      <div className="w-full text-center flex flex-col flex-grow gap-10">
        <h1 className="font-semibold text-3xl text-center">Nuevo paciente</h1>
        <FormPacienteSecretaria />
      </div>
    </div>
  );
}
