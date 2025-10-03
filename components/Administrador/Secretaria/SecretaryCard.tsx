import { Practitioner, Secretary } from "@/app/definitions/definitions";
import React from "react";
import { useRouter } from "next/navigation";
import { useDeleteOneSecretaryMutation } from "@/app/redux/api/secretary.api";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
interface Props {
  secretary: Secretary;
}
export default function SecretaryCard({ secretary }: Props) {

  const router = useRouter();

  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const [deleteSecretary,
    {
      isLoading: isLoadingDeleteSecretary,
      isSuccess: isSuccessDeleteSecretary,
      isError: isErrorDeleteSecretary,
    }
  ] = useDeleteOneSecretaryMutation()

  const handleEdit = () => {
    router.push(`/administrator/editarSecretaria/${secretary.id}`);
  };

  const handleDelete = async () => {

    Swal.fire({
      title: '¿Seguro?',
      icon: "question",
      text: `Estas a punto de eliminar a ${secretary.name} ${secretary.lastName}, este cambio es irreversible.`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: "#087374",
      denyButtonText: 'No',
      customClass: {
        actions: 'my-actions',
        confirmButton: 'order-2',
        denyButton: 'order-1',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteSecretary({
            id: secretary.id,
            token: token,
          }).unwrap()
          Swal.fire({
            icon: "success",
            title: "¡Exito!",
            text: `Secretaria eliminada exitosamente`,
            timer: 2000,
            timerProgressBar: true,
          });
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Ocurrió un error",
            text: `${error.data.message}`,
            timer: 10000,
            timerProgressBar: true,
          });
        }
      }
    })
  };

  return (
    <div className="flex md:flex-row flex-col items-center justify-between border-b-2 border-[#078B8C] p-2">
      <div className=" w-[90%] flex md:flex-row flex-col items-center md:gap-5 gap-7">
        {/*Imagen*/}
        <img
          className="w-15 h-15 rounded-full"
          src={`${secretary?.urlImg
            ? secretary?.urlImg
            : "/UserIconPlaceholder.jpg"
            }`}
        />
        <div className=" w-1/3 flex md:flex-row flex-col gap-1.5">
          {/*Nombre del usuario*/}
          <span>{secretary.name}</span>
          <span>{secretary.lastName}</span>
        </div>
        <div className=" w-1/3 flex flex-row gap-1.5">
        <img src="/mail.svg"/>
          {secretary.email
            ? secretary.email
            : "Sin datos"}
        </div>
        {/*Especializacion*/}
        <div className="flex flex-col items-center gap-1.5  w-1/3">
          {/*Dni y Telefono*/}
          <span className="flex flex-row gap-1"><img src="/phone-black.svg"/>{secretary.phone ? secretary.phone : "Sin datos"}</span>
          <span className="flex flex-row gap-1"><img src="/dni-black.svg"/>{secretary.dni ? secretary.dni : "Sin datos"}</span>
        </div>
      </div>
      <div className="items-center">
        <button
          onClick={handleEdit}
          className="btn shadow-none border-none bg-transparent hover:bg-[#078B8C33]"
        >
          <img className="w-7 h-7" src="/edit_square_black.svg" />
        </button>
        <button
          onClick={() => handleDelete()}
          className="btn shadow-none border-none bg-transparent hover:bg-[#078B8C33]"
        >
          <img className="w-7 h-7" src="/delete_black.svg" />
        </button>
      </div>
    </div>
  );
}
