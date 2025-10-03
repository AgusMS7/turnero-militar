import Image from "next/image";
interface Props {
  nombre: string;
  foto: string;
}

export default function HeaderEstadisticasMedico({ nombre, foto }: Props) {
  return (
    <nav className="flex justify-between items-center p-2 px-4 border-b-2 border-gray-400">
      <div>
        <Image
          src={foto?foto:"/UserIconPlaceholder.jpg"}
          alt=""
          width={30}
          height={30}
          className="rounded-full object-cover w-10 h-10 border-2 border-black"
        />
      </div>

      <span className=" text-black text-center font-bold w-full ">
        {nombre}
      </span>
    </nav>
  );
}
