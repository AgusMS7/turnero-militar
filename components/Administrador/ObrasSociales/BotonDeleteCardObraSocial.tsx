import { SocialWork, TokenWithId } from "@/app/definitions/definitions";
import { useSoftDeleteSocialWorkMutation } from "@/app/redux/api/socialWork.api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Swal from "sweetalert2";

interface Props {
  obraSocial: SocialWork;
}

export default function BotonDeleteCardObraSocial({ obraSocial }: Props) {
  const { data: sesion } = useSession();
  const [softDeleteSocialWork, { isSuccess, isError }] =
    useSoftDeleteSocialWorkMutation();

  const handleDelete = async () => {
    Swal.fire({
      icon: "warning",
      title: "Atencion!",
      text: `¿Esta seguro que quiere borrar la obra social ${obraSocial.name}?`,
      confirmButtonText: "Si",
      showCancelButton: true,
      cancelButtonText: "No",
      reverseButtons: true
    }).then( async(res) => {
      if (res.isConfirmed) {
        const tokenWithId: TokenWithId = {
          id: obraSocial.id,
          token: sesion?.user.accessToken,
        };

        await softDeleteSocialWork(tokenWithId);
      }
    });
  };

  if (isError) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Ocurrio un error al intentar borrar la obra social ${obraSocial.name}`,
      confirmButtonText: "Aceptar",
    });
  }

  if (isSuccess) {
    Swal.fire({
      icon: "success",
      title: "Operacion exitosa",
      text: `La obra social ${obraSocial.name} fue borrada correctamente`,
      confirmButtonText: "Aceptar",
    });
  }

  return (
    <button className="hover:cursor-pointer" onClick={handleDelete}>
      <Image src={"/delete-fullSalud.png"} alt="" width={27} height={27} />
    </button>
  );
}
