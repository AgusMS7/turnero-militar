"use client";
import { useDeletePractitionerSocialWorkMutation } from "@/app/redux/api/practitionerSocialWork.api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { title } from "process";
import Swal from "sweetalert2";
interface Props {
  practitionerSocialWorkId: string;
}
export default function DeleteButton({ practitionerSocialWorkId }: Props) {
  const { data: session } = useSession();

  const [deletePractitionerSocialWork] =
    useDeletePractitionerSocialWorkMutation();
  return (
    <button
      className="btn p-3 bg-inherit"
      onClick={() => {
        Swal.fire({
          title: "¿Estás seguro?",
          text: "No podrás revertir esto",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Sí, eliminarlo",
          cancelButtonText: "No, cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            deletePractitionerSocialWork({
              id: practitionerSocialWorkId,
              token: session?.user.accessToken || "",
            })
              .unwrap()
              .then(() => {
                Swal.fire({
                  title: "Eliminado",
                  text: "La obra social ha sido eliminada",
                  icon: "success",
                  confirmButtonText: "Aceptar",
                });
              })
              .catch((error) => {
                Swal.fire({
                  title: "Error al borrar",
                  text: "Ocurrio un error al borrar la obra social",
                  icon: "error",
                  confirmButtonText: "Aceptar",
                });
              });
          }
        });
      }}
    >
      <Image src="/delete.svg" alt="delete" width={15} height={15} />
    </button>
  );
}
