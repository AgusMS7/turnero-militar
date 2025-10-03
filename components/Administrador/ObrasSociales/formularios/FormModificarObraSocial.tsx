"use client";
import {
  SocialWork,
  TokenWithEntity,
  TokenWithId,
} from "@/app/definitions/definitions";
import {
  useCreateSocialWorkMutation,
  useGetOneSocialWorkQuery,
  useUpdateSocialWorkMutation,
} from "@/app/redux/api/socialWork.api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { z } from "zod";

const obraSocialSchema = z.object({
  name: z.string().min(1, "Debe completar este campo"),
  phone: z.string().min(1, "Debe completar este campo"),
  website: z.string().min(1, "Debe completar este campo"),
});

export default function FormNuevaObraSocial() {
  const { data: sesion } = useSession();
  const { id } = useParams();
  const tokenConIdObra: TokenWithId = {
    id: id as string,
    token: sesion?.user.accessToken,
  };
  const {
    data: obra,
    isLoading: cargandoObra,
    isSuccess: obraCargada,
  } = useGetOneSocialWorkQuery(tokenConIdObra);
  const router = useRouter();
  const [obraSocial, setObraSocial] = useState<SocialWork>({} as SocialWork);

  useEffect(() => {
    if (obra && obraCargada) {
      setObraSocial(obra);
    }
  }, [obra]);

  const [errors, setErrors] =
    useState<Partial<Record<keyof SocialWork, string>>>();

  const [
    updateSocialWork,
    { isError: errorAlModificar, isSuccess: modificada },
  ] = useUpdateSocialWorkMutation();

  const validarCampos = () => {
    const result = obraSocialSchema.safeParse(obraSocial);

    if (!result.success) {
      let errores: Partial<Record<keyof SocialWork, string>> = {};

      result.error.errors.forEach((err) => {
        const path = err.path[0] as keyof SocialWork;
        errores[path] = err.message;
      });

      setErrors(errores);

      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  useEffect(() => {
    validarCampos();
  }, [obraSocial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validarCampos()) {
      const obraModificada: Partial<SocialWork> = {
        id: obraSocial.id,
        name: obraSocial.name,
        phone: obraSocial.phone,
        website: obraSocial.website,
      };
      const entityToken: TokenWithEntity = {
        token: sesion?.user.accessToken,
        entity: obraModificada,
      };

      await updateSocialWork(entityToken);
    }
  };

  if (modificada) {
    Swal.fire({
      icon: "success",
      title: "Operacion exitosa",
      text: `La obra social ${obraSocial.name} se modifico exitosamente`,
      confirmButtonText: "Continuar",
      willClose: ()=>{
        router.push("/administrator/obrasSociales");
      }
    })
  }

  if (errorAlModificar) {
    Swal.fire({
      icon: "error",
      title: "Ocurrio un error",
      text: "Error al modificar la obra social. Intente nuevamente más tarde",
      confirmButtonText: "Ok",
    });
  }

  return (
    <form
      className="w-2/3 rounded-2xl m-auto text-start text-xl p-5 flex flex-col gap-5 *:m-auto [&_div]:w-full 
      [&_h3]:text-red-500
        [&_label]:font-bold
        [&_input]:border-gray-400 [&_input]:w-full [&_input]:border [&_input]:p-5 
        [&_input]:bg-[#F1F1F1] [&_input]:rounded-xl [&_input]:focus:outline-none
        [&_select]:border-[#A4D4D4] [&_select]:w-full [&_select]:border [&_select]:p-5 
        [&_select]:bg-[#F1F1F1] [&_select]:rounded-md [&_select]:focus:outline-none
        "
      onSubmit={handleSubmit}
    >
      {/**Numero y Plan */}
      <div className="flex gap-5">
        <div>
          <label>Nombre</label>
          <input
            value={obraSocial.name ?? ""}
            onChange={(e) =>
              setObraSocial((prev) => {
                return { ...prev, name: e.target.value };
              })
            }
            type="text"
          />
          {errors?.name && <h3>{errors.name}</h3>}
        </div>
        <div>
          <label>Telefono</label>
          <input
            value={obraSocial.phone ?? ""}
            onChange={(e) =>
              setObraSocial((prev) => {
                return { ...prev, phone: e.target.value };
              })
            }
            type="number"
          />
          {errors?.phone && <h3>{errors.phone}</h3>}
        </div>
      </div>
      <div>
        <div>
          <label>Link del sitio web</label>
          <input
            value={obraSocial.website ?? ""}
            onChange={(e) =>
              setObraSocial((prev) => {
                return { ...prev, website: e.target.value };
              })
            }
            type="text"
          />
          {errors?.website && <h3>{errors.website}</h3>}
        </div>
      </div>
      <div className="flex justify-center gap-5 p-5">
        <Link
          className="bg-white border-2 border-gray-300 text-[#087374] p-2 w-1/3 rounded-full font-bold text-center"
          href={"/administrator/obrasSociales"}
        >
          Volver
        </Link>
        <button
          type="submit"
          className="bg-[#087374] hover:cursor-pointer text-white p-2 w-1/3 rounded-full font-bold"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
