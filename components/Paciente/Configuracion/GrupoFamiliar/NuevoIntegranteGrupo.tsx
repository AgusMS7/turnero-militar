"use client";

import { Patient, TokenWithEntity } from "@/app/definitions/definitions";
import { useCreateFamilyMemberPatientMutation } from "@/app/redux/api/patient.api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { z } from "zod";

const completarCampo = "Debe completar este campo";

const integranteSchema = z.object({
  name: z.string().min(1, completarCampo),
  lastName: z.string().min(1, completarCampo),
  gender: z.string().min(1, completarCampo),
  documentType: z.string().min(1, completarCampo),
  dni: z.string().min(1, completarCampo),
  birth: z
    .string()
    .min(10, completarCampo)
    .refine((fecha) => {
      if (!isNaN(new Date(fecha).getTime())) {
        const hoy = new Date();
        const fechaIngresada = new Date(fecha);

        return fechaIngresada.getTime() <= hoy.getTime();
      } else {
        return true;
      }
    }, "La fecha no puede ser futura"),
});

export default function NuevoIntegranteGrupo() {
  const router = useRouter();
  const { data: sesion } = useSession();
  const [integrante, setIntegrante] = useState<Partial<Patient>>({
    name: "",
    lastName: "",
    birth: "",
    gender: "",
    documentType: "",
    dni: "",
    headPatientId: sesion?.user.id,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createFamilyMember, { isError, isSuccess }] =
    useCreateFamilyMemberPatientMutation();

  const validarCampos = () => {
    const result = integranteSchema.safeParse(integrante);

    if (!result.success) {
      let errores: Record<string, string> = {};

      result.error.errors.forEach((err) => {
        const path = err.path.join(".");
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
  }, [integrante]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validarCampos()) {
      const tokenWithEntity: TokenWithEntity = {
        token: sesion?.user.accessToken,
        entity: { ...integrante },
      };

      try {
        await createFamilyMember(tokenWithEntity).unwrap();

        await Swal.fire({
          icon: "success",
          title: "Operacion exitosa",
          text: `${integrante.name} ${integrante.lastName} fue agregado al grupo correctamente`,
          confirmButtonText: "Aceptar",
          willClose: () => {
            router.push("/paciente/configuracion/grupo-familiar");
          },
        });
      } catch (error: any) {

        const mensajeError = error?.data?.message || "Ocurrio un error inesperado";

        await Swal.fire({
          icon: "error",
          title: "Error",
          text: mensajeError,
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#CDE8E8] shadow rounded-2xl w-3xl max-lg:w-full p-10 m-auto text-start flex flex-col gap-10
        [&_label]:text-xl [&_label]:font-semibold
        [&_h3]:text-red-500
        [&_input]:bg-white [&_input]:border-gray-400 [&_input]:border
        [&_input]:rounded-lg [&_input]:p-2 [&_input]:w-full [&_input]:focus:outline-none
        [&_select]:bg-white [&_select]:border-gray-400 [&_select]:border 
        [&_select]:rounded-lg [&_select]:p-2 [&_select]:w-full [&_select]:focus:outline-none
        "
    >
      <div>
        <h1 className="text-2xl font-bold">Datos del familiar</h1>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label>Nombre/s</label>
          <input
            onChange={(e) =>
              setIntegrante((prev) => ({ ...prev, name: e.target.value }))
            }
            value={integrante?.name as string}
            placeholder="Ingrese nombre/s"
            type="text"
          />
          {errors["name"] && <h3>{errors["name"]}</h3>}
        </div>
        <div className="flex flex-col">
          <label>Apellido/s</label>
          <input
            onChange={(e) =>
              setIntegrante((prev) => ({ ...prev, lastName: e.target.value }))
            }
            value={integrante?.lastName as string}
            placeholder="Ingrese apellido/s"
            type="text"
          />
          {errors["lastName"] && <h3>{errors["lastName"]}</h3>}
        </div>
        <div className="grid grid-cols-2 max-md:flex-col max-md:flex gap-5">
          <div>
            <label>Fecha de nacimiento</label>
            <input
              onChange={(e) =>
                setIntegrante((prev) => ({ ...prev, birth: e.target.value }))
              }
              value={integrante?.birth as string}
              type="date"
            />
            {errors["birth"] && <h3>{errors["birth"]}</h3>}
          </div>
          <div>
            <label>Género</label>
            <select
              onChange={(e) =>
                setIntegrante((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={integrante?.gender as string}
              className="select"
            >
              <option disabled value="">
                --Seleccionar--
              </option>
              <option value="male">Hombre</option>
              <option value="female">Mujer</option>
              <option value="other">Otro</option>
              <option value="rather_not_say">Prefiero no decir</option>
            </select>
            {errors["gender"] && <h3>{errors["gender"]}</h3>}
          </div>
        </div>
        <div className="grid grid-cols-2 max-md:flex max-md:flex-col gap-5">
          <div>
            <label>Tipo de documento</label>
            <select
              onChange={(e) =>
                setIntegrante((prev) => ({
                  ...prev,
                  documentType: e.target.value,
                }))
              }
              value={integrante?.documentType as string}
              className="select"
            >
              <option disabled value="">
                --Seleccionar--
              </option>
              <option value="dni">DNI</option>
              <option value="passport">Pasaporte</option>
            </select>
            {errors["documentType"] && <h3>{errors["documentType"]}</h3>}
          </div>
          <div>
            <label>Numero de documento</label>
            <input
              onChange={(e) =>
                setIntegrante((prev) => ({ ...prev, dni: e.target.value }))
              }
              value={integrante?.dni as string}
              placeholder="Ingrese numero"
              type="text"
            />
            {errors["dni"] && <h3>{errors["dni"]}</h3>}
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-5 *:py-2 *:px-10 *:rounded-full *:font-semibold">
        <Link
          className="bg-white text-[#078B8C] border border-gray-400 hover:scale-110 transition-all"
          href={"/paciente/configuracion/grupo-familiar"}
        >
          Volver
        </Link>
        <button
          type="submit"
          className="bg-[#078B8C] text-white hover:cursor-pointer hover:scale-110 transition-all"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
