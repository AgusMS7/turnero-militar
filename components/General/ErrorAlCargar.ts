import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export const errorAlCargar = (texto: string, ruta: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  Swal.fire({
    title: "Error. Intente nuevamente más tarde.",
    text: texto,
    confirmButtonText: "Volver",
    icon: "error",
    willClose: () => {
      router.push(ruta);
    },
  });
};
