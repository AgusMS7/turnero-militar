import { Patient } from "@/app/definitions/definitions";
import SnackbarDatos from "../Historial/SnackbarDatos";

interface Props {
  patient: Partial<Patient>;
}
export default function DatosPaciente({ patient }: Props) {
  return (
    <div className="text-black flex flex-col space-y-4">
      <h1 className="text-xl">Datos del Paciente</h1>
      <SnackbarDatos titulo={"Nombre"} cuerpo={patient.name || ""} />
      <SnackbarDatos titulo={"Apellido"} cuerpo={patient.lastName || ""} />
      <SnackbarDatos
        titulo={"Cobertura Medica"}
        cuerpo={
          patient.socialWorkEnrollment?.socialWork?.name ||
          "El paciente no tiene cobertura médica"
        }
      />
      <SnackbarDatos titulo={"DNI"} cuerpo={patient.dni || ""} />
      <SnackbarDatos titulo={"Email"} cuerpo={patient.email || ""} />
      <SnackbarDatos titulo={"Telefono"} cuerpo={patient.phone || ""} />
    </div>
  );
}
