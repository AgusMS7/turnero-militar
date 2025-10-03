import Image from "next/image";

interface Props {
  status: string;
}

const TurnoStatus: React.FC<Props> = ({ status }) => {
  let imageSrc = "";
  let statusText = "";

  switch (status) {
    case "approved":
      imageSrc = "/turno-aprobado.svg";
      statusText = "Confirmado";
      break;
    case "cancelled":
      imageSrc = "/turno-cancelado.svg";
      statusText = "Cancelado";
      break;
    case "completed":
      imageSrc = "/turno-completado.svg";
      statusText = "Completado";
      break;
    case "under_review":
      imageSrc = "/turno-en-revision.png";
      statusText = "Sin Confirmar";
      break;
    default:
      imageSrc = "/turno-en-revision.png";
      statusText = "Sin Confirmar";
      break;
  }

  return (
    <div className="flex items-center gap-2 mt-4">
      <p className="font-bold">Estado de turno</p>
      <Image
        src={imageSrc}
        alt={`turno ${statusText.toLowerCase()}`}
        width={22}
        height={22}
      />
      <span className="font-bold">{statusText}</span>
    </div>
  );
};

export default TurnoStatus;