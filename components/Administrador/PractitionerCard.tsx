import { Practitioner, TokenWithId } from "@/app/definitions/definitions";
import React from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { usePractitionerSoftDeleteMutation } from "@/app/redux/api/practitioner.api";
import { useSession } from "next-auth/react";
interface Props {
  practitioner: Practitioner;
}
export default function PractitionerCard({ practitioner }: Props) {

  const { data: session } = useSession();

  const token = session?.user.accessToken;

  const router = useRouter();


  const [
    softDeletePractitioner,
    { 
      isError: errorAlBorrar, 
      isSuccess: borrado 
    },
  ] = usePractitionerSoftDeleteMutation();




  const handleEdit = () => {
    router.push(`/administrator/editarProfesional/${practitioner.id}`);
  };

  const handleDelete = async () => {
    Swal.fire({
      title: 'Atencion',
      icon: "warning",
      text: `¿Seguro que quiere borrar al medico ${practitioner.name} ${practitioner.lastName}?`,
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
          const response = await softDeletePractitioner({
            id: practitioner.id,
            token: token,
          }).unwrap()
          Swal.fire({
            icon: "success",
            title: "¡Exito!",
            text: `El medico ${practitioner.name} ${practitioner.lastName} fue borrado correctamente`,
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
    <div className="flex items-center justify-between border-b-2 border-[#078B8C] p-2">
      <div className="grid grid-cols-3 items-center justify-center text-center w-full">
        <div className="flex items-center gap-3 text-start">
          {/*Imagen*/}
          <img
            className="w-15 h-15 rounded-full"
            src={`${practitioner?.urlImg
                ? practitioner?.urlImg
                : "/UserIconPlaceholder.jpg"
              }`}
          />
          {/*Nombre del usuario*/}
          <span>
            {practitioner.name} {practitioner.lastName}
          </span>
        </div>
        <div className="flex flex-row gap-1.5">
          <img src="/health-black.svg"/>
          {practitioner.professionalDegree
            ? practitioner.professionalDegree.profession.name
            : "Sin datos"}
        </div>
        {/*Especializacion*/}
        <div className="flex flex-col items-center">
          {/*Email y matricula*/}
          <span className="flex flex-row gap-1.5"><img src="/mail.svg"/>{practitioner.email}</span>
          <span className="flex flex-row gap-1.5"><img src="/badge-black.svg"/>{practitioner.license}</span>
        </div>
      </div>
      <div className="flex items-center">
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
