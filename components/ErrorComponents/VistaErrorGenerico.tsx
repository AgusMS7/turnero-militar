import Image from "next/image";
import HeaderPage from "../PageComponents/HeaderPage";
interface Props {
  titulo: string;
  cuerpo: string;
  tituloHeader: string;
  urlRetorno?: string;
}
export default function VistaErrorGenerico({ titulo, cuerpo,tituloHeader,urlRetorno }: Props) {
  return (
    <div>
      <HeaderPage titulo={tituloHeader} urlRetorno={urlRetorno}/>
      <div className="px-3">
        <div>
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
        </div>
        <div className="flex flex-col space-y-4 p-3 rounded-2xl border border-[#A4D4D4] bg-[#F1F1F1] lg:w-[35%] lg:mx-auto">
          <div className="w-full flex justify-center items-center">
            <Image
              src="/crossError.svg"
              alt="errorIcon"
              width={100}
              height={100}
              className="p-2 rounded-full shadow-xl border-2 border-[#c04747] bg-white"
            />
          </div>
          <div className="text-center text-black flex flex-col space-y-4">
            <h1 className="font-bold text-lg">{titulo}</h1>
            <p>{cuerpo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}