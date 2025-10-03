import InfoSecretaria from "@/components/Administrador/Secretaria/InfoSecretaria/InfoSecretaria";

export default function EditarProfesionalPage() {
  return (
    <InfoSecretaria
      useSessionUser={false}
      backUrl="/administrator/secretarias"
      fullWidth={true}
    />
  );
}
