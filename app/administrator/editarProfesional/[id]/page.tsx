import InfoMedico from "@/components/Secretaria/InfoMedico/InfoMedico";

export default function EditarProfesionalPage() {
  return (
    <InfoMedico
      useSessionUser={false}
      backUrl="/administrator"
      fullWidth={true}
    />
  );
}
