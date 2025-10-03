import InfoSecretaria from "@/components/Administrador/Secretaria/InfoSecretaria/InfoSecretaria";

export default function MisDatosPage() {
  return (
    <InfoSecretaria
      useSessionUser={false}
      backUrl="/secretaria/configuracion"
      fullWidth={true}
    />
  );
}