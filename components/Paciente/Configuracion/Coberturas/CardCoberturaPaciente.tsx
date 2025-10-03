import {
  Patient,
  SocialWork,
  TokenWithEntity,
} from "@/app/definitions/definitions";
import Link from "next/link";
import Image from "next/image";
import { useGetAllSocialWorksQuery } from "@/app/redux/api/socialWork.api";
import { useSession } from "next-auth/react";
import { useUpdatePatientByIdMutation } from "@/app/redux/api/patient.api";
import Swal from "sweetalert2";

interface Props {
  paciente: Partial<Patient>;
}

export default function CardCoberturaPaciente({ paciente }: Props) {
  const { data: sesion } = useSession();
  const { data: obrasSociales } = useGetAllSocialWorksQuery(
    sesion?.user.accessToken
  );
  const [updatePatient] = useUpdatePatientByIdMutation();

  const handleBorrar = async () => {
    Swal.fire({
      icon: "warning",
      title: "Atencion",
      text: `¿Está seguro que desea borrar la cobertura de ${paciente.name} ${paciente.lastName}?`,
      confirmButtonText: "Si",
      showCancelButton: true,
      cancelButtonText: "No",
      reverseButtons: true,
    }).then(async (response) => {
      if (response.isConfirmed) {
        const particular: SocialWork = obrasSociales?.socialWorks.find(
          (obra) => obra.name == "Particular"
        ) as SocialWork;

        const sinObra: Partial<Patient> = {
          id: paciente.id,
          socialWorkEnrollment: {
            id: paciente.socialWorkEnrollment?.id,
            memberNum: "",
            plan: "",
            socialWork: particular,
          },
        };

        const tokenWithEntity: TokenWithEntity = {
          token: sesion?.user.accessToken,
          entity: sinObra,
        };

        try {
          await updatePatient(tokenWithEntity);
          Swal.fire({
            icon: "success",
            title: "Operacion exitosa",
            text: `La cobertura del paciente ${paciente.name} ${paciente.lastName} se elimino correctamente`,
            confirmButtonText: "Aceptar",
          });
        } catch (error: any) {
          const mensajeError =
            error?.data?.message || "Ocurrio un error inesperado";

          Swal.fire({
            icon: "error",
            title: "Error",
            text: mensajeError,
            confirmButtonText: "Aceptar",
          });
        }
      }
    });
  };

  return (
    <div
      className="bg-[#BDBDBD33] flex flex-col gap-5 border-l-10 shadow-md shadow-gray-500 border-[#087374] rounded-2xl w-2xl max-md:w-full max-md:px-5 m-auto text-start px-10 py-5
    [&_h2]:opacity-60 [&_h2]:font-bold [&_h2]:text-lg
    "
    >
      <div className="flex gap-5 justify-between max-md:flex-col-reverse items-center">
        <div className="flex gap-5 items-center max-md:mr-auto">
          <h1 className="font-bold text-xl">
            {paciente.name} {paciente.lastName}
          </h1>
          <img
            className="rounded-full border-2 max-md:hidden"
            src={paciente.urlImg ?? "/user.svg"}
            alt=""
            height={35}
            width={35}
          />
        </div>
        <div className="flex gap-5 max-md:ml-auto">
          <Link
            href={`/paciente/configuracion/cobertura/formulario/${paciente.id}`}
            title="Modificar"
          >
            <Image
              src={"/edit-square-full-salud-colorsvg.svg"}
              alt=""
              height={30}
              width={30}
            />
          </Link>
          <button
            type="button"
            title="Borrar"
            className="hover:cursor-pointer"
            onClick={handleBorrar}
          >
            <Image src={"/paciente/borrar.png"} alt="" height={30} width={30} />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2>DNI: {paciente.dni}</h2>
        <h2>
          Fecha de nacimiento:{" "}
          {new Date(
            new Date(paciente.birth as string).getTime() + 1000 * 60 * 60 * 24
          ).toLocaleDateString()}
        </h2>
        <h2>Numero de socio: {paciente.socialWorkEnrollment?.memberNum}</h2>
        <h2>Plan: {paciente.socialWorkEnrollment?.plan}</h2>
      </div>
      <div className="text-end text-[#087374]">
        <h1 className="font-bold text-xl">
          {paciente.socialWorkEnrollment?.socialWork?.name}
        </h1>
      </div>
    </div>
  );
}
