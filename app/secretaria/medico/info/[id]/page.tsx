import InfoMedico from "@/components/Secretaria/InfoMedico/InfoMedico";

export default function MedicoInfo() {
  return <InfoMedico useSessionUser={false} backUrl="/secretaria/medicos" />;
}
