import Image from "next/image";
interface Props {
  statusCode: string;
}
export default function VerifyContainer({ statusCode }: Props) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#E4ECEC]">
      <Image src={"/image-ingreso.png"} alt="image" width={480} height={142} />
      <div className="w-full p-3">
        <div className="h-full flex flex-col items-center justify-center p-2 gap-3 bg-white border-2 border-[#A4D4D4] rounded-md">
          <div className="bg-white rounded-full border-2 p-1">
            <Image
              src={
                statusCode == "LOADING"
                  ? "/hourglass.svg"
                  : statusCode == "OK"
                  ? "/check.svg"
                  : "/cross.svg"
              }
              alt="verificacion"
              width={100}
              height={100}
            />
          </div>

          <h1 className="text-xl font-bold text-center">
            {statusCode == "LOADING"
              ? "Verificando la cuenta..."
              : statusCode == "OK"
              ? "Exito al verificar cuenta"
              : "Error al verificar cuenta"}
          </h1>
          <p className="p-2 text-center text-xl">
            {statusCode == "LOADING"
              ? "Espere unos momentos..."
              : statusCode == "OK"
              ? "Tu cuenta ya ha sido verificada, ya puedes usar el servicio...."
              : "Ocurrio un error al verificar tu cuenta, intentelo mas tarde"}
          </p>
        </div>
      </div>
    </div>
  );
}
