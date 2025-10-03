import { pdf } from "@react-pdf/renderer";
import TurnoPDF from "./TurnoPDF";

interface Props {
  nombre: string;
  fecha: string;
  hora: string;
}

function corregirFecha(fecha?: string) {
  if (!fecha || !fecha.includes("-")) {
    return "";
  }

  const fechaArray = fecha.split("-");
  return `${fechaArray[2]}/${fechaArray[1]}/${fechaArray[0]}`;
}

export default function ModalConfirmacionTurno({ nombre, fecha, hora }: Props) {
  const handleDownload = async () => {
    const blob = await pdf(
      <TurnoPDF nombre={nombre} fecha={corregirFecha(fecha)} hora={hora} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "detalle_turno.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <dialog id="modalConfirmTurn" className="modal modal-bottom p-4 ">
      <div
        id="captura"
        className="modal-box max-w-md w-full mx-auto  rounded-3xl text-black text-center border-4 border-[#A4D4D4] pt-10"
      >
        <h3 className="font-bold">¡Su turno ha sido solicitado con éxito!</h3>
        <p className="py-6">
          Ha solicitado un turno con {nombre} el día {corregirFecha(fecha)} a
          las {hora}
        </p>
        <p>¿Desea guardar el detalle del turno?</p>
        <div className="flex justify-center gap-7 mt-8 font-semibold ">
          <button className="cursor-pointer bg-transparent border-2 border-[#A4D4D4] text-[#078B8C] px-2 py-2 rounded-lg" onClick={() => {
            const modal = document.getElementById("modalConfirmTurn") as HTMLDialogElement;
            modal.close();
          }}>
            No, gracias
          </button>

          <button
            className="bg-[#078B8C] text-white px-2.5 py-2.5 rounded-lg"
            onClick={handleDownload}
          >
            Guardar
          </button>
        </div>
      </div>
    </dialog>
  );
}