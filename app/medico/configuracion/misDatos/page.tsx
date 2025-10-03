import InfoMedico from "@/components/Secretaria/InfoMedico/InfoMedico";

export default function MisDatosPage() {
  return (
    <InfoMedico
      useSessionUser={true}
      backUrl="/medico/configuracion"
      fullWidth={true}
    />
  );
}
